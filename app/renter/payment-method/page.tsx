"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { APIError, authAPI } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";

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
      <div className="ds-panel rounded-[10px] px-4 py-4">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "14px",
                color: "#ffffff",
                "::placeholder": { color: "rgba(255,255,255,0.4)" },
              },
              invalid: {
                color: "#fca5a5",
              },
            },
          }}
        />
      </div>
      {error && (
        <div className="ds-pill-red px-3 py-2 rounded-lg text-[12px]">
          {error}
        </div>
      )}
      {success && (
        <div className="ds-pill-green px-3 py-2 rounded-lg text-[12px]">
          {success}
        </div>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting || !stripe}
          className="ds-btn ds-btn-primary h-10 px-5 text-[13px] rounded-lg disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save card"}
        </button>
        <Link
          href="/renter"
          className="ds-btn ds-btn-ghost h-10 px-5 text-[13px] rounded-lg"
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
    <DashboardLayout role="renter">
      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="ds-card-lg p-6 md:p-8">
          <h1 className="ds-h5 mb-1">Add payment method</h1>
          <p className="ds-footnote mb-6">
            Your card is stored with Stripe and used to authorize/capture winning bids.
          </p>

          {stripeUnavailable ? (
            <div className="ds-pill-red px-3 py-2 rounded-lg text-[12px]">
              Missing <code className="font-mono">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in frontend env.
            </div>
          ) : (
            <Elements stripe={stripePromise}>
              <PaymentMethodForm />
            </Elements>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
