"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Shield, ArrowLeft, CreditCard, Lock, Loader2, Tag, AlertCircle } from "lucide-react";
import { formatInrAmount, parseCurrencyAmount } from "../../../lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

function PaymentStep() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formRef = useRef(null);

  const leadId = searchParams.get("leadId");
  const planId = searchParams.get("planId") || "";
  const planName = searchParams.get("planName") || "Professional Consultation";
  const planPriceStr = searchParams.get("planPrice") || "1499.00";

  const planAmountStr = searchParams.get("planAmount") || "";
  const parsedPrice = parseCurrencyAmount(planAmountStr) ?? parseCurrencyAmount(planPriceStr);
  const isCustomQuote =
    parsedPrice === null ||
    String(planPriceStr).toLowerCase().includes("quote") ||
    String(planPriceStr).toLowerCase().includes("custom") ||
    String(planName).toLowerCase().includes("custom");

  const displayPrice = isCustomQuote
    ? planPriceStr || "Custom Quote"
    : formatInrAmount(parsedPrice);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payuParams, setPayuParams] = useState(null);
  const [payuBaseUrl, setPayuBaseUrl] = useState("");
  const [rewardPreview, setRewardPreview] = useState(null);
  const [rewardLoading, setRewardLoading] = useState(false);

  const payableBase = rewardPreview?.eligible ? rewardPreview.finalAmount : parsedPrice;
  const rewardDiscount = rewardPreview?.eligible ? rewardPreview.discountAmount : 0;
  const gstAmount = isCustomQuote
    ? null
    : formatInrAmount(payableBase * 0.18);
  const totalAmount = isCustomQuote
    ? planPriceStr || "Custom Quote"
    : formatInrAmount(payableBase * 1.18);

  useEffect(() => {
    if (!leadId || isCustomQuote) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRewardLoading(true);
    const params = new URLSearchParams({ leadId, amount: String(parsedPrice) });

    fetch(`${API_URL}/api/referral-rewards/payment-preview?${params.toString()}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok) setRewardPreview(data.data);
      })
      .catch(() => {})
      .finally(() => setRewardLoading(false));
  }, [leadId, isCustomQuote, parsedPrice]);

  useEffect(() => {
    if (payuParams && formRef.current) {
      formRef.current.submit();
    }
  }, [payuParams]);

  const handlePay = async () => {
    if (!leadId) {
      setError("Invalid Request: Lead ID is missing.");
      return;
    }
    if (isCustomQuote) {
      setError("Custom quote plans require admin approval. Our team will contact you.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          leadId,
          planId: planId || undefined,
          planName,
          amount: String(Number(parsedPrice).toFixed(2)),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      setPayuBaseUrl(data.data.payuBaseUrl);
      setPayuParams(data.data.params);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 md:py-12 px-4">
      {payuParams && (
        <form ref={formRef} method="POST" action={payuBaseUrl} style={{ display: "none" }}>
          {Object.entries(payuParams).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}

      <div className="mb-10 text-center">
        <ul className="steps w-full max-w-md mx-auto">
          <li className="step step-primary font-bold opacity-70">Contact</li>
          <li
            className="step step-primary font-bold cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              let url = `/nextstep-registration?leadId=${leadId}`;
              if (planName !== "Professional Consultation") url += `&planName=${encodeURIComponent(planName)}`;
              if (planPriceStr !== "1499.00") url += `&planPrice=${encodeURIComponent(planPriceStr)}`;
              if (planAmountStr) url += `&planAmount=${encodeURIComponent(planAmountStr)}`;
              router.push(url);
            }}
          >
            Details
          </li>
          <li className="step step-primary font-bold">Payment</li>
        </ul>
      </div>

      <div className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-gold-content flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">Secure Payment</h2>
            <p className="text-sm opacity-80 mt-0.5">Powered by PayU · 256-bit SSL</p>
          </div>
          <div className="flex items-center gap-2 opacity-80">
            <Shield size={20} />
            <CreditCard size={28} />
          </div>
        </div>

        <div className="card-body p-8 md:p-4 md:p-12">
          <div className="space-y-6">
            <div className="p-6 rounded-none bg-base-200/50 border border-base-200 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Order Summary</p>

              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">{planName}</span>
                <span className="font-semibold">{displayPrice}</span>
              </div>

              {!isCustomQuote && rewardLoading && (
                <div className="text-xs opacity-50">Checking referral reward eligibility...</div>
              )}

              {!isCustomQuote && !rewardLoading && rewardPreview?.eligible && (
                <>
                  <div className="flex justify-between items-center text-sm text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Tag size={14} />
                      Referral Reward ({rewardPreview.discountPercent}% off)
                    </span>
                    <span>-₹{Number(rewardDiscount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm opacity-60">
                    <span>Discounted Price</span>
                    <span>₹{Number(payableBase).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </>
              )}

              {!isCustomQuote && (
                <div className="flex justify-between items-center text-sm opacity-60">
                  <span>GST (18%)</span>
                  <span>{gstAmount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-base-300 flex justify-between items-center">
                <span className="text-base font-bold">Total Amount Due</span>
                <span className="text-2xl font-black text-gold">{totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-sm p-4">
              <Lock className="text-emerald-600 shrink-0" size={18} />
              <div>
                <p className="text-xs font-bold text-emerald-800">Secured by PayU</p>
                <p className="text-xs text-emerald-700 opacity-80">
                  Your payment is encrypted and secured. We never store your card details.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 opacity-50 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-7" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/RuPay.svg" alt="RuPay" className="h-5" />
              <span className="text-xs font-bold">UPI</span>
              <span className="text-xs font-bold">Net Banking</span>
            </div>

            {error && (
              <div className="alert alert-error rounded-sm flex gap-3">
                <AlertCircle size={18} className="shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {isCustomQuote && (
              <div className="alert alert-info rounded-sm">
                <Shield size={18} />
                <div>
                  <p className="font-bold text-sm">Custom Quote Plan</p>
                  <p className="text-xs opacity-80">Our team will reach out to you with a tailored quote shortly.</p>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-outline flex-1 rounded-sm h-14 font-bold gap-2"
                disabled={loading}
              >
                <ArrowLeft size={18} /> Go Back
              </button>
              <button
                type="button"
                onClick={handlePay}
                className="btn btn-primary flex-[2] rounded-sm h-14 font-bold text-lg gap-3 shadow-lg shadow-primary/20"
                disabled={loading || isCustomQuote}
                id="payu-pay-button"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Redirecting to PayU...
                  </span>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay {!isCustomQuote ? totalAmount : ""}
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs opacity-40 mt-2">
              By clicking Pay, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentStepPage() {
  return (
    <div className="bg-base-200/50 min-h-screen">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <span className="loading loading-spinner loading-lg text-gold"></span>
          </div>
        }
      >
        <PaymentStep />
      </Suspense>
    </div>
  );
}
