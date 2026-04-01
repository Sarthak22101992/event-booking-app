"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (mode === "signup" && !name) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (signUpError) { setError(signUpError.message); setLoading(false); return; }
      setMessage("Account created! You can now sign in.");
      setMode("signin");
      setPassword("");
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) { setError("Invalid email or password."); setLoading(false); return; }
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center p-6 overflow-hidden" style={{ background: "#06060f" }}>

      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb-1 absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full" style={{ background: "#7c3aed", filter: "blur(130px)" }} />
        <div className="orb-2 absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full" style={{ background: "#1d4ed8", filter: "blur(130px)" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl shrink-0"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", boxShadow: "0 0 24px #6366f155" }}>
            <span className="text-xl select-none">🎟</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#06060f]" style={{ boxShadow: "0 0 8px #06b6d4" }} />
          </div>
          <span className="text-2xl font-extrabold"
            style={{ background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            RESERVA
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 p-8 animate-card-enter" style={{ background: "rgba(255,255,255,0.04)" }}>

          {/* Toggle */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-8">
            <button onClick={() => { setMode("signin"); setError(""); setMessage(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "signin" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
              Sign In
            </button>
            <button onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "signup" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
              Create Account
            </button>
          </div>

          {/* Fields */}
          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name"
              className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500" />
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" type="email"
            className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500" />
          <div className="relative mb-6">
            <input value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Password" type={showPassword ? "text" : "password"}
              className="w-full p-3 pr-11 rounded-lg bg-white/10 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-lg">
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Error / Success */}
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          {message && <p className="text-green-400 text-sm mb-4 text-center">{message}</p>}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all py-3 rounded-xl font-semibold">
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← Back to events
          </Link>
        </div>
      </div>
    </div>
  );
}
