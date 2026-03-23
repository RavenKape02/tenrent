"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { APIError, authAPI } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function PaymentMethodForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const setup = await authAPI.createStripeSetupIntent();
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card input not ready");

      const result = await stripe.confirmCardSetup(setup.client_secret, {
        payment_method: { card },
      });
      if (result.error) throw new Error(result.error.message || "Unable to set up card");

      const pm = result.setupIntent?.payment_method;
      const paymentMethodId = typeof pm === "string" ? pm : null;
      if (!paymentMethodId) throw new Error("No payment method returned by Stripe");

      await authAPI.setStripePaymentMethod(paymentMethodId);
      await refreshUser();
      setSuccess("Card saved successfully. You can now place bids.");
      setTimeout(() => router.push("/renter"), 800);
    } catch (e: unknown) {
      if (e instanceof APIError) setError(e.message);
      else setError(e instanceof Error ? e.message : "Failed to save payment method");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-3">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "14px",
                color: "#111827",
                "::placeholder": { color: "#9ca3af" },
              },
            },
          }}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || !stripe}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save card"}
        </button>
        <Link
          href="/renter"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default function RenterPaymentMethodPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
    else if (!loading && user && user.user_type !== "renter") router.push("/landlord");
  }, [loading, user, router]);

  const stripeUnavailable = useMemo(() => !pk, [pk]);
  if (loading || !user) return null;

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Add payment method</h1>
      <p className="mt-1 text-sm text-gray-600">
        Your card is stored with Stripe and used to authorize/capture winning bids.
      </p>

      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
        {stripeUnavailable ? (
          <p className="text-sm text-red-600">
            Missing <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in frontend env.
          </p>
        ) : (
          <Elements stripe={stripePromise}>
            <PaymentMethodForm />
          </Elements>
        )}
      </div>
    </main>
  );
}

