import type { ReactNode } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import { cn } from "@/lib/utils";

interface ListingsShellProps {
  children: ReactNode;
  maxWidthClassName?: string;
  mainClassName?: string;
}

export function ListingsShell({
  children,
  maxWidthClassName = "max-w-7xl",
  mainClassName,
}: ListingsShellProps) {
  return (
    <div className="min-h-screen bg-[#05090f] text-slate-100 relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-20 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-500/8 blur-[120px]" />
      </div>

      <Header />

      <main
        className={cn(
          "relative z-10 mx-auto w-full px-6 py-10",
          maxWidthClassName,
          mainClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
}

interface ListingsCardProps {
  children: ReactNode;
  className?: string;
}

export function ListingsCard({ children, className }: ListingsCardProps) {
  return (
    <section className={cn("ds-card-lg p-6", className)}>
      {children}
    </section>
  );
}

interface ListingsCenteredStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function ListingsCenteredState({
  title,
  description,
  action,
}: ListingsCenteredStateProps) {
  return (
    <ListingsCard className="text-center py-12">
      <p className="ds-headline">{title}</p>
      {description && <p className="ds-body mt-2">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </ListingsCard>
  );
}

export function ListingsSpinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
    </div>
  );
}

interface ListingsBackLinkProps {
  href?: string;
  label?: string;
  className?: string;
}

export function ListingsBackLink({
  href = "/listings",
  label = "Back to listings",
  className,
}: ListingsBackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 ds-footnote text-white/60 hover:text-white transition-colors",
        className,
      )}
    >
      <span aria-hidden>←</span>
      <span>{label}</span>
    </Link>
  );
}
