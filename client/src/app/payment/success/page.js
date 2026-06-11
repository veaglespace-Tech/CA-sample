"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Download } from "lucide-react";

function PaymentSuccess() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get("txnid");
  const leadId = searchParams.get("leadId");
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          window.location.href = "/dashboard/user";
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
          {/* Top decoration */}
          <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

          <div className="p-10 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center animate-pulse">
                  <CheckCircle className="text-emerald-500" size={52} strokeWidth={1.5} />
                </div>
                <div className="absolute -inset-1 rounded-full border-2 border-emerald-200 animate-ping opacity-40" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-3">Payment Successful! 🎉</h1>
            <p className="text-gray-500 text-base leading-relaxed mb-2">
              Your payment has been processed successfully. Our team of experts will start working on your application immediately.
            </p>

            {txnid && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-medium">Transaction Reference</p>
                <p className="text-sm font-mono font-bold text-gray-700 mt-0.5">{txnid}</p>
              </div>
            )}

            {/* Countdown */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
              <div className="w-5 h-5 rounded-full border-2 border-emerald-300 flex items-center justify-center text-xs font-bold text-emerald-600">
                {countdown}
              </div>
              <span>Redirecting to your dashboard…</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/dashboard/user"
                className="flex-1 btn btn-primary rounded-2xl h-12 font-bold text-sm gap-2"
              >
                Go to Dashboard <ArrowRight size={16} />
              </Link>
              <Link
                href="/"
                className="flex-1 btn btn-ghost rounded-2xl h-12 font-bold text-sm border border-gray-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Support note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Need help?{" "}
          <Link href="/contact" className="text-emerald-600 font-semibold hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      }
    >
      <PaymentSuccess />
    </Suspense>
  );
}
