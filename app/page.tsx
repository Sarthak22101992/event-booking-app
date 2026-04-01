"use client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleBooking = async (eventTitle) => {
    if (!name || !email) {
      alert("Please enter name & email");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, event: eventTitle }),
      });

      setSuccess(`🎉 Booking confirmed for ${eventTitle}!`);
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
      setSuccess("❌ Booking failed");
    }

    setLoading(false);
  };

  const events = [
    {
      title: "DJ Night",
      artist: "Martin Garrix",
      price: "€50",
      seats: 12,
    },
    {
      title: "Live Band",
      artist: "Coldplay Tribute",
      price: "€70",
      seats: 5,
    },
    {
      title: "AI Talk",
      artist: "Elon Musk",
      price: "Free",
      seats: 25,
    },
    {
      title: "Startup Pitch",
      artist: "YC Founders",
      price: "€20",
      seats: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-8">

      {/* 🔥 Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text animate-pulse">
        🚀 Book Your Next Experience
      </h1>

      {/* 🧾 Booking Form */}
      <div className="max-w-xl mx-auto mb-12 backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />

        <button
          onClick={() => selectedEvent && handleBooking(selectedEvent)}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 active:scale-95 transition-all duration-200 py-3 rounded-lg font-semibold shadow-lg"
        >
          {loading ? "Booking..." : selectedEvent ? `Book ${selectedEvent}` : "Select Event First"}
        </button>

        {success && (
          <p className="text-green-400 mt-4 text-center animate-bounce">
            {success}
          </p>
        )}
      </div>

      {/* 🎟️ Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {events.map((event, index) => (
          <div
            key={index}
            onClick={() => setSelectedEvent(event.title)}
            className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer
              ${selectedEvent === event.title
                ? "border-blue-500 scale-105 shadow-2xl shadow-blue-500/30"
                : "border-white/10 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
              }
              bg-white/5`}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-10 transition"></div>

            <h2 className="text-xl font-bold mb-2">{event.title}</h2>
            <p className="text-gray-300 mb-1">{event.artist}</p>
            <p className="mb-2 font-semibold">{event.price}</p>

            {/* 🎯 Seats Feature */}
            <p
              className={`text-sm mb-4 ${event.seats <= 5 ? "text-red-400 animate-pulse" : "text-green-400"
                }`}
            >
              {event.seats} seats left
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBooking(event.title);
              }}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 py-2 rounded-lg"
            >
              {loading ? "Booking..." : "Book Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}