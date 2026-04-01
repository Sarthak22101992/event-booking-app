"use client";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    category: "Bookings",
    items: [
      {
        q: "How do I book an event?",
        a: "Browse events on the home page, click 'Book Now' on the event you want, enter your name and email, then click 'Confirm Booking'. You'll receive a confirmation email instantly.",
      },
      {
        q: "Can I book multiple events?",
        a: "Yes! You can book as many different events as you like. However, each event can only be booked once per account to ensure fair access for all attendees.",
      },
      {
        q: "How do I cancel a booking?",
        a: "Go to 'My Bookings' (via the footer or your account menu), find the booking you want to cancel, and click the 'Cancel' button. Your seat will be released back to the event immediately.",
      },
      {
        q: "Can I transfer my ticket to someone else?",
        a: "Ticket transfers are currently not supported through the platform. Please contact our support team at support@reserva.com for assistance.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We accept VISA, Mastercard, iDEAL, PayPal, and Apple Pay. All payments are processed securely and encrypted using industry-standard SSL.",
      },
      {
        q: "Is it safe to pay on RESERVA?",
        a: "Absolutely. RESERVA is PCI DSS compliant and uses 256-bit SSL encryption for all transactions. Your payment details are never stored on our servers.",
      },
      {
        q: "When will I be charged?",
        a: "Payment is processed immediately at the time of booking. You'll receive a confirmation email with your receipt and booking reference.",
      },
      {
        q: "Can I get a refund?",
        a: "Refunds are available up to 48 hours before the event start time. After that, bookings are non-refundable. To request a refund, visit My Bookings and cancel your booking.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        q: "Do I need an account to book?",
        a: "No — you can book as a guest by entering your name and email. However, creating a free account lets you auto-fill your details, view booking history, and cancel bookings easily.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "On the Sign In page, click 'Forgot password?' and enter your email. You'll receive a password reset link within a few minutes. Check your spam folder if it doesn't arrive.",
      },
      {
        q: "How do I update my name or email?",
        a: "Once logged in, go to your Profile page to update your display name. Email changes require identity verification and can be requested at support@reserva.com.",
      },
    ],
  },
  {
    category: "Events",
    items: [
      {
        q: "How do I find events in my city?",
        a: "Use the search bar at the top of the home page and type your city name (e.g. 'Amsterdam'). You can also use the Sort: City A–Z option to browse by location.",
      },
      {
        q: "What does 'Almost Full' mean?",
        a: "'Almost Full' means less than 10% of seats remain for that event. We recommend booking quickly as these events sell out fast.",
      },
      {
        q: "Can I see past events?",
        a: "Yes — on the home page, toggle from 'Upcoming' to 'Past' in the filter bar to see events that have already taken place.",
      },
      {
        q: "I have a question about a specific event.",
        a: "For event-specific queries, reply to your confirmation email or contact us at events@reserva.com and our team will respond within 24 hours.",
      },
    ],
  },
];

export default function HelpPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen text-white p-8 overflow-hidden" style={{ background: "#06060f" }}>

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb-1 absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full" style={{ background: "#7c3aed", filter: "blur(130px)" }} />
        <div className="orb-2 absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full" style={{ background: "#1d4ed8", filter: "blur(130px)" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1 mb-6">
            ← Back to RESERVA
          </Link>
          <div className="flex items-center gap-3 mt-4 mb-1">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl shrink-0"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", boxShadow: "0 0 24px #6366f155" }}>
              <span className="text-xl select-none">🎟</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#06060f]" style={{ boxShadow: "0 0 8px #06b6d4" }} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold"
                style={{ background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Help Center
              </h1>
              <p className="text-gray-400 text-sm">Frequently asked questions</p>
            </div>
          </div>
        </div>

        {/* Contact banner */}
        <div className="rounded-2xl p-5 mb-10 flex items-center justify-between gap-4 border border-blue-500/20"
          style={{ background: "rgba(29,78,216,0.1)" }}>
          <div>
            <p className="text-white font-semibold text-sm">Still need help?</p>
            <p className="text-gray-400 text-xs mt-0.5">Our support team is available Mon–Fri, 9:00–18:00 CET</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-blue-300 text-xs font-medium">📞 +31 20 847 3920</p>
            <p className="text-blue-300 text-xs mt-1">✉️ support@reserva.com</p>
          </div>
        </div>

        {/* FAQ sections */}
        {FAQS.map((section) => (
          <div key={section.category} className="mb-8">
            <h2 className="text-white font-semibold text-sm uppercase tracking-widest mb-4 opacity-60">{section.category}</h2>
            <div className="space-y-2">
              {section.items.map((item) => {
                const key = `${section.category}-${item.q}`;
                const isOpen = openItem === key;
                return (
                  <div key={key}
                    className="rounded-xl border border-white/10 overflow-hidden transition-all"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <button
                      onClick={() => setOpenItem(isOpen ? null : key)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left">
                      <span className="text-white text-sm font-medium pr-4">{item.q}</span>
                      <span className={`text-gray-400 text-lg transition-transform duration-200 shrink-0 ${isOpen ? "rotate-45" : ""}`}>+</span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4">
                        <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-20 pb-6 border-t border-white/5 pt-8">
        <p style={{ background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block", fontWeight: 700 }}>
          🎟️ RESERVA
        </p>
        <p className="text-gray-600 text-xs mt-1">© 2026 RESERVA B.V. · Amsterdam, Netherlands</p>
      </div>
    </div>
  );
}
