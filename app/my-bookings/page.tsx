"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);

type Booking = {
  id: number;
  event_id: number;
  event_title: string;
  name: string;
  email: string;
  created_at: string;
};

export default function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!isValidEmail(email)) return;
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false });
    setBookings(data ?? []);
    setSearched(true);
    setLoading(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-NL", { day: "numeric", month: "short", year: "numeric" }) +
      " · " + d.toLocaleTimeString("en-NL", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative min-h-screen text-white p-8 overflow-hidden" style={{ background: "#06060f" }}>

      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb-1 absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full" style={{ background: "#7c3aed", filter: "blur(130px)" }} />
        <div className="orb-2 absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full" style={{ background: "#1d4ed8", filter: "blur(130px)" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors mb-6 inline-flex items-center gap-1">
            ← Back to RESERVA
          </Link>
          <div className="flex items-center gap-3 mt-4 mb-1">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl shrink-0"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", boxShadow: "0 0 24px #6366f155" }}>
              <span className="text-xl select-none">🎟</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#06060f]" style={{ boxShadow: "0 0 8px #06b6d4" }} />
            </div>
            <h1 className="text-3xl font-extrabold"
              style={{ background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              My Bookings
            </h1>
          </div>
          <p className="text-gray-400 text-sm">Enter your email to see your booking history</p>
        </div>

        {/* Search box */}
        <div className="flex gap-3 mb-8">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Your email address"
            className={`flex-1 p-3 rounded-lg bg-white/10 border focus:outline-none focus:ring-2 text-white placeholder-gray-500
              ${email && !isValidEmail(email) ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-blue-500"}`}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !isValidEmail(email)}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all px-5 rounded-lg font-semibold">
            {loading ? "..." : "Search"}
          </button>
        </div>

        {/* Results */}
        {searched && (
          bookings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-white font-semibold text-lg">No bookings found</p>
              <p className="text-gray-400 text-sm mt-1">No bookings are associated with this email</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 text-sm mb-4">{bookings.length} booking{bookings.length > 1 ? "s" : ""} found</p>
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b.id} className="rounded-2xl border border-white/10 p-5 animate-card-enter"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-white font-semibold text-lg">{b.event_title}</p>
                        <p className="text-gray-400 text-sm mt-1">👤 {b.name}</p>
                        <p className="text-gray-500 text-xs mt-2">🕐 Booked on {formatDate(b.created_at)}</p>
                      </div>
                      <span className="text-green-400 text-xl shrink-0">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-20 pb-6 border-t border-white/5 pt-8">
        <p style={{ background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block", fontWeight: 700 }}>
          🎟️ RESERVA
        </p>
        <p className="text-gray-600 text-xs mt-1">© 2026 RESERVA · All rights reserved</p>
      </div>

    </div>
  );
}
