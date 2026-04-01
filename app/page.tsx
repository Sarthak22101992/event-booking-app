"use client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");

  const handleBooking = async (eventTitle: string) => {
    if (!name || !email) {
      alert("Please enter name & email first");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          event: eventTitle,
        }),
      });

      setSuccess(`🎉 Booked for ${eventTitle}!`);
      setSelectedEvent(eventTitle);
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
      seats: 20,
    },
    {
      title: "Live Band",
      artist: "Coldplay Tribute",
      price: "€70",
      seats: 12,
    },
    {
      title: "AI Talk",
      artist: "Elon Musk",
      price: "Free",
      seats: 50,
    },
    {
      title: "Startup Pitch",
      artist: "YC Founders",
      price: "€20",
      seats: 8,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-8">

      {/* HEADER */}
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide">
        🎟️ Book Your Next Experience
      </h1>

      {/* FORM */}
      <div className="max-w-xl mx-auto mb-12">
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
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 py-3 rounded-lg font-semibold"
        >
          {loading ? "Processing..." : "Select Event Below"}
        </button>

        {success && (
          <p className="text-green-400 mt-4 text-center animate-pulse">
            {success}
          </p>
        )}
      </div>

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg 
            hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 
            transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-500"
          >
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-300 mb-2">{event.artist}</p>
            <p className="mb-2">{event.price}</p>

            {/* SEATS */}
            <p
              className={`mb-4 text-sm ${event.seats < 10 ? "text-red-400" : "text-green-400"
                }`}
            >
              {event.seats} seats left
            </p>

            {/* PROGRESS BAR */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${(event.seats / 50) * 100}%`,
                }}
              ></div>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => handleBooking(event.title)}
              disabled={loading}
              className={`w-full py-2 rounded-lg transition-all duration-200 
              ${selectedEvent === event.title
                  ? "bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700"
                } active:scale-95`}
            >
              {selectedEvent === event.title
                ? "Booked ✔"
                : loading
                  ? "Booking..."
                  : "Book Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}