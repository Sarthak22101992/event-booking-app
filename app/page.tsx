"use client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");

  // ✅ CHANGE 1: make events state so seats can update
  const [events, setEvents] = useState([
    {
      title: "DJ Night",
      artist: "Martin Garrix",
      price: "€50",
      seats: 20,
      date: "Apr 12, 2026",
      time: "10:00 PM",
    },
    {
      title: "Live Band",
      artist: "Coldplay Tribute",
      price: "€70",
      seats: 12,
      date: "Apr 18, 2026",
      time: "8:00 PM",
    },
    {
      title: "AI Talk",
      artist: "Elon Musk",
      price: "Free",
      seats: 50,
      date: "Apr 25, 2026",
      time: "3:00 PM",
    },
    {
      title: "Startup Pitch",
      artist: "YC Founders",
      price: "€20",
      seats: 8,
      date: "May 2, 2026",
      time: "6:00 PM",
    },
  ]);

  const handleBooking = async (eventTitle: string, eventDate: string, eventTime: string) => {
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
          date: eventDate,
          time: eventTime,
        }),
      });

      // ✅ CHANGE 2: reduce seats after booking
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.title === eventTitle && event.seats > 0
            ? { ...event, seats: event.seats - 1 }
            : event
        )
      );

      setSuccess(`🎉 Booked for ${eventTitle}!`);
      setSelectedEvent(eventTitle);
    } catch (err) {
      console.error(err);
      setSuccess("❌ Booking failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-8">

      {/* ✅ CHANGE 3: TITLE UPDATED */}
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide">
        🎟️ RESERVA
      </h1>

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
            <p className="text-gray-400 text-sm mb-2">📅 {event.date} &nbsp; 🕐 {event.time}</p>
            <p className="mb-2">{event.price}</p>

            <p
              className={`mb-4 text-sm ${event.seats < 10 ? "text-red-400" : "text-green-400"
                }`}
            >
              {event.seats} seats left
            </p>

            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${(event.seats / 50) * 100}%`,
                }}
              ></div>
            </div>

            <button
              onClick={() => handleBooking(event.title, event.date, event.time)}
              disabled={loading || event.seats === 0}
              className={`w-full py-2 rounded-lg transition-all duration-200 
              ${selectedEvent === event.title
                  ? "bg-green-600"
                  : "bg-blue-600 hover:bg-blue-700"
                } active:scale-95`}
            >
              {event.seats === 0
                ? "Sold Out"
                : selectedEvent === event.title
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