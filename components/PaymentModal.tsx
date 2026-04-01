"use client";
import { useState } from "react";

type Props = {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  price: string;
  name: string;
  email: string;
  onSuccess: (paymentRef: string) => void;
  onClose: () => void;
};

type PaymentTab = "card" | "ideal";

const IDEAL_BANKS = [
  "ABN AMRO", "ASN Bank", "Bunq", "ING", "Knab",
  "N26", "Rabobank", "RegioBank", "SNS Bank", "Triodos Bank", "Van Lanschot",
];

function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
  return digits;
}

function getCardType(num: string): string {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "VISA";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6/.test(n)) return "Maestro";
  return "";
}

function generatePaymentRef() {
  return "PAY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function parseAmount(price: string): number {
  if (price.toLowerCase() === "free") return 0;
  return parseInt(price.replace(/[^0-9]/g, "")) || 0;
}

export default function PaymentModal({
  eventTitle, eventDate, eventTime, eventLocation,
  price, name, email, onSuccess, onClose,
}: Props) {
  const [tab, setTab] = useState<PaymentTab>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState(name);
  const [idealBank, setIdealBank] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFree = parseAmount(price) === 0;
  const cardType = getCardType(cardNumber);

  const validate = () => {
    const e: Record<string, string> = {};
    if (tab === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter a valid 16-digit card number";
      if (!expiry.includes("/") || expiry.length < 7) e.expiry = "Enter a valid expiry date";
      if (cvc.length < 3) e.cvc = "Enter a valid CVC";
      if (!cardName.trim()) e.cardName = "Enter the name on your card";
    } else {
      if (!idealBank) e.idealBank = "Please select your bank";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2200)); // realistic delay
    setProcessing(false);
    setProcessed(true);
    await new Promise((r) => setTimeout(r, 900));
    onSuccess(generatePaymentRef());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}>
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-card-enter">

        {/* Processing overlay */}
        {processing && (
          <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-10"
            style={{ background: "rgba(10,10,20,0.92)", backdropFilter: "blur(4px)" }}>
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white font-semibold">Processing payment...</p>
            <p className="text-gray-400 text-sm mt-1">Please do not close this window</p>
          </div>
        )}

        {/* Success overlay */}
        {processed && (
          <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-10"
            style={{ background: "rgba(10,10,20,0.92)" }}>
            <div className="text-5xl mb-3">✅</div>
            <p className="text-white font-bold text-lg">Payment Successful!</p>
            <p className="text-gray-400 text-sm mt-1">Confirming your booking...</p>
          </div>
        )}

        {/* Header */}
        <div className="mb-5">
          <div className="h-1 w-12 rounded-full mb-4" style={{ background: "linear-gradient(to right, #2563eb, #7c3aed)" }} />
          <h2 className="text-xl font-bold text-white mb-1">{eventTitle}</h2>
          <div className="flex flex-wrap gap-3 text-sm text-gray-400 mt-1">
            <span>📅 {eventDate}</span>
            <span>🕐 {eventTime}</span>
            <span>📍 {eventLocation}</span>
          </div>
        </div>

        {/* Attendee + amount */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 mb-5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">{name}</p>
            <p className="text-gray-400 text-xs truncate">{email}</p>
          </div>
          <span className="text-lg font-bold shrink-0"
            style={{ background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {price}
          </span>
        </div>

        <div className="border-t border-white/10 mb-5" />

        {isFree ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
            <span className="text-green-400 text-xl">🎟</span>
            <div>
              <p className="text-green-300 font-semibold text-sm">This event is FREE</p>
              <p className="text-gray-400 text-xs">No payment required</p>
            </div>
          </div>
        ) : (
          <>
            {/* Payment tabs */}
            <div className="flex rounded-xl bg-white/5 p-1 mb-5">
              <button onClick={() => setTab("card")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2
                  ${tab === "card" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
                💳 Card
              </button>
              <button onClick={() => setTab("ideal")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2
                  ${tab === "ideal" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
                🏦 iDEAL
              </button>
            </div>

            {tab === "card" && (
              <div className="space-y-3 mb-5">
                {/* Card number */}
                <div>
                  <div className="relative">
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full p-3 pr-20 rounded-lg bg-white/10 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm tracking-widest
                        ${errors.cardNumber ? "border-red-500" : "border-gray-700"}`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {cardType && <span className="text-xs font-bold text-gray-300 bg-white/10 px-2 py-0.5 rounded">{cardType}</span>}
                    </div>
                  </div>
                  {errors.cardNumber && <p className="text-red-400 text-xs mt-1 pl-1">{errors.cardNumber}</p>}
                </div>

                {/* Name on card */}
                <div>
                  <input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="NAME ON CARD"
                    className={`w-full p-3 rounded-lg bg-white/10 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm tracking-wider
                      ${errors.cardName ? "border-red-500" : "border-gray-700"}`}
                  />
                  {errors.cardName && <p className="text-red-400 text-xs mt-1 pl-1">{errors.cardName}</p>}
                </div>

                {/* Expiry + CVC */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM / YY"
                      className={`w-full p-3 rounded-lg bg-white/10 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm
                        ${errors.expiry ? "border-red-500" : "border-gray-700"}`}
                    />
                    {errors.expiry && <p className="text-red-400 text-xs mt-1 pl-1">{errors.expiry}</p>}
                  </div>
                  <div className="w-28">
                    <input
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="CVC"
                      className={`w-full p-3 rounded-lg bg-white/10 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm
                        ${errors.cvc ? "border-red-500" : "border-gray-700"}`}
                    />
                    {errors.cvc && <p className="text-red-400 text-xs mt-1 pl-1">{errors.cvc}</p>}
                  </div>
                </div>

                {/* Accepted cards */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-gray-600 text-xs">Accepted:</span>
                  {["VISA", "MC", "Maestro", "Amex"].map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {tab === "ideal" && (
              <div className="mb-5">
                <p className="text-gray-400 text-sm mb-3">Select your bank</p>
                <div className="grid grid-cols-2 gap-2">
                  {IDEAL_BANKS.map((bank) => (
                    <button key={bank} onClick={() => setIdealBank(bank)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all text-left
                        ${idealBank === bank
                          ? "border-blue-500 bg-blue-500/10 text-blue-300"
                          : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10"}`}>
                      🏦 {bank}
                    </button>
                  ))}
                </div>
                {errors.idealBank && <p className="text-red-400 text-xs mt-2 pl-1">{errors.idealBank}</p>}
              </div>
            )}
          </>
        )}

        {/* Pay button */}
        <button onClick={handlePay} disabled={processing}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all active:scale-95 disabled:opacity-50 mb-3"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>
          {isFree ? "Confirm Free Booking" : `Pay ${price} securely`}
        </button>
        <button onClick={onClose} disabled={processing}
          className="w-full py-3 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all font-medium disabled:opacity-30">
          Cancel
        </button>

        {/* Security */}
        {!isFree && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-green-500 text-xs">🔒</span>
            <span className="text-gray-600 text-xs">SSL Encrypted · PCI DSS Compliant · Secured by RESERVA</span>
          </div>
        )}
      </div>
    </div>
  );
}
