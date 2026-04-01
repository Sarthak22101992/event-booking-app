"use client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");

  const handleBooking = async (eventName?: string) => {
    setLoading(true);
    setSuccess(false);

    if (eventName) setSelectedEvent(eventName);

    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, event: selectedEvent }),
      });

      setSuccess(true);
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const events = [
    { title: "DJ Night", artist: "Martin Garrix", price: "€50" },
    { title: "Live Band", artist: "Coldplay Tribute", price: "€70" },
    { title: "AI Talk", artist: "Elon Musk", price: "Free" },
    { title: "Startup Pitch", artist: "YC Founders", price: "€20" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 tracking-wide">
        🎟️ Book Your Next Experience
      </h1>

      <div className="max-w-xl mx-auto mb-10">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => handleBooking()}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 py-3 rounded-lg font-semibold"
        >
          {loading ? "Booking..." : "Book Now"}
        </button>

        {success && (
          <div className="mt-6 text-center animate-bounce">
            <p className="text-green-400 text-lg">
              🎉 Booking Confirmed!
            </p>
            {selectedEvent && (
              <p className="text-gray-300 text-sm mt-2">
                You booked: {selectedEvent}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2 hover:text-blue-400 transition">
              {event.title}
            </h2>
            <p className="text-gray-300 mb-2">{event.artist}</p>
            <p className="mb-4">{event.price}</p>

            <button
              onClick={() => handleBooking(event.title)}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 py-2 rounded-lg"
            >
              {loading ? "Booking..." : "Book Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}