"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, HeadphonesIcon } from "lucide-react";

const FAILURE_REASONS = {
  hash_mismatch: "Payment verification failed. Please try again or contact support.",
  server_error: "A server error occurred while processing your payment.",
  cancelled: "Payment was cancelled by you.",
};

function PaymentFailure() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get("txnid");
  const leadId = searchParams.get("leadId");
  const reason = searchParams.get("reason");
  const errorMessage = FAILURE_REASONS[reason] || "Your payment could not be processed. No amount has been deducted.";

  const retryUrl = leadId
    ? `/payment-step?leadId=${leadId}&retry=1`
    : "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Failure Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100">
          {/* Top decoration */}
          <div className="h-2 bg-gradient-to-r from-red-400 to-orange-400" />

          <div className="p-10 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="text-red-400" size={52} strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-3">Payment Failed</h1>
            <p className="text-gray-500 text-base leading-relaxed">{errorMessage}</p>

            {txnid && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-medium">Transaction Reference</p>
                <p className="text-sm font-mono font-bold text-gray-700 mt-0.5">{txnid}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              {leadId && (
                <Link
                  href={retryUrl}
                  className="flex-1 btn btn-primary rounded-2xl h-12 font-bold text-sm gap-2"
                >
                  <RefreshCw size={16} /> Retry Payment
                </Link>
              )}
              <Link
                href="/contact"
                className="flex-1 btn btn-outline rounded-2xl h-12 font-bold text-sm gap-2"
              >
                <HeadphonesIcon size={16} /> Contact Support
              </Link>
            </div>

            <Link
              href="/"
              className="block text-sm text-gray-400 hover:text-gray-600 mt-4 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          No amount has been deducted. If your account was charged, please{" "}
          <Link href="/contact" className="text-red-500 font-semibold hover:underline">
            contact us immediately.
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }
    >
      <PaymentFailure />
    </Suspense>
  );
}
