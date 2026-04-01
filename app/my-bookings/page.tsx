"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setEmail(session.user.email ?? "");
        setUserName(session.user.user_metadata?.full_name ?? "");
        fetchBookings(session.user.email ?? "");
      }
    });
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBookings = async (emailToSearch: string) => {
    if (!emailToSearch) return;
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("email", emailToSearch)
      .order("created_at", { ascending: false });
    setBookings(data ?? []);
    setSearched(true);
    setLoading(false);
  };

  const handleSearch = () => {
    if (!isValidEmail(email)) return;
    fetchBookings(email);
  };

  const handleCancel = async (booking: Booking) => {
    setCancellingId(booking.id);
    try {
      // Delete booking
      const { error: deleteError } = await supabase
        .from("bookings")
        .delete()
        .eq("id", booking.id);
      if (deleteError) throw deleteError;

      // Increment seats back
      const { data: eventData } = await supabase
        .from("events")
        .select("seats")
        .eq("id", booking.event_id)
        .single();
      if (eventData) {
        await supabase
          .from("events")
          .update({ seats: eventData.seats + 1 })
          .eq("id", booking.event_id);
      }

      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      showToast("Booking cancelled successfully", "success");
    } catch {
      showToast("Failed to cancel. Please try again.", "error");
    }
    setCancellingId(null);
    setConfirmCancelId(null);
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

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-medium animate-slide-in
          ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}

      <div className="relative z-10 max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1">
              ← Back to RESERVA
            </Link>
            {isLoggedIn && (
              <button onClick={() => { supabase.auth.signOut(); router.push("/"); }}
                className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                Sign Out
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 mt-4 mb-1">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl shrink-0"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", boxShadow: "0 0 24px #6366f155" }}>
              <span className="text-xl select-none">🎟</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#06060f]" style={{ boxShadow: "0 0 8px #06b6d4" }} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold"
                style={{ background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                My Bookings
              </h1>
              {isLoggedIn && userName && (
                <p className="text-gray-400 text-sm">Welcome back, {userName}</p>
              )}
            </div>
          </div>
          {!isLoggedIn && <p className="text-gray-400 text-sm mt-2">Enter your email to see your booking history</p>}
        </div>

        {/* Search box — only shown when not logged in */}
        {!isLoggedIn && (
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
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading your bookings...</p>
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          bookings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-white font-semibold text-lg">No bookings found</p>
              <p className="text-gray-400 text-sm mt-1">No bookings are associated with this email</p>
              <Link href="/" className="mt-4 text-blue-400 hover:text-blue-300 text-sm underline inline-block">
                Browse events →
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 text-sm mb-4">{bookings.length} booking{bookings.length > 1 ? "s" : ""} found</p>
              <div className="space-y-4">
                {bookings.map((b, i) => (
                  <div key={b.id} className="rounded-2xl border border-white/10 p-5 animate-card-enter"
                    style={{ background: "rgba(255,255,255,0.04)", animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-lg">{b.event_title}</p>
                        <p className="text-gray-400 text-sm mt-1">👤 {b.name}</p>
                        <p className="text-gray-500 text-xs mt-2">🕐 Booked on {formatDate(b.created_at)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-green-400 text-lg">✓</span>
                        {confirmCancelId === b.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCancel(b)}
                              disabled={cancellingId === b.id}
                              className="text-xs px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all active:scale-95 disabled:opacity-50">
                              {cancellingId === b.id ? "..." : "Confirm"}
                            </button>
                            <button
                              onClick={() => setConfirmCancelId(null)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-all">
                              Keep
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmCancelId(b.id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-all border border-white/10 hover:border-red-500/30">
                            Cancel
                          </button>
                        )}
                      </div>
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
