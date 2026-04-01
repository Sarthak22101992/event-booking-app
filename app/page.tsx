"use client";
import { useState } from "react";

const CATEGORY_COLORS: Record<string, string> = {
  Music:    "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  Tech:     "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  Business: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  Sports:   "bg-green-500/20 text-green-300 border border-green-500/30",
  Comedy:   "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  Food:     "bg-pink-500/20 text-pink-300 border border-pink-500/30",
};

const FILTER_ACTIVE = "bg-blue-600 text-white";
const FILTER_INACTIVE = "bg-white/10 text-gray-300 hover:bg-white/20";

function getCountdown(dateStr: string): string {
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today!";
  if (diff === 1) return "Tomorrow!";
  if (diff < 0) return "Past event";
  return `${diff} days away`;
}

const ALL_EVENTS = [
  {
    title: "DJ Night",
    artist: "Martin Garrix",
    price: "€50",
    seats: 20,
    maxSeats: 20,
    date: "Apr 12, 2026",
    time: "10:00 PM",
    location: "O2 Arena, London",
    category: "Music",
  },
  {
    title: "Live Band",
    artist: "Coldplay Tribute",
    price: "€70",
    seats: 12,
    maxSeats: 12,
    date: "Apr 18, 2026",
    time: "8:00 PM",
    location: "Royal Albert Hall, London",
    category: "Music",
  },
  {
    title: "AI Talk",
    artist: "Elon Musk",
    price: "Free",
    seats: 50,
    maxSeats: 50,
    date: "Apr 25, 2026",
    time: "3:00 PM",
    location: "Convention Center, SF",
    category: "Tech",
  },
  {
    title: "Startup Pitch",
    artist: "YC Founders",
    price: "€20",
    seats: 8,
    maxSeats: 30,
    date: "May 2, 2026",
    time: "6:00 PM",
    location: "YC HQ, Mountain View",
    category: "Business",
  },
  {
    title: "Boxing Night",
    artist: "Anthony Joshua vs. Fury",
    price: "€120",
    seats: 35,
    maxSeats: 35,
    date: "May 10, 2026",
    time: "9:00 PM",
    location: "Madison Square Garden, NY",
    category: "Sports",
  },
  {
    title: "Stand-Up Night",
    artist: "Kevin Hart",
    price: "€45",
    seats: 18,
    maxSeats: 40,
    date: "May 15, 2026",
    time: "7:30 PM",
    location: "Comedy Cellar, NYC",
    category: "Comedy",
  },
  {
    title: "Food Festival",
    artist: "Top Chefs of Europe",
    price: "€30",
    seats: 60,
    maxSeats: 60,
    date: "May 22, 2026",
    time: "12:00 PM",
    location: "Riverside Park, Dublin",
    category: "Food",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(ALL_EVENTS.map((e) => e.category)))];

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [animatingEvent, setAnimatingEvent] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [events, setEvents] = useState(ALL_EVENTS);

  const filteredEvents = activeFilter === "All"
    ? events
    : events.filter((e) => e.category === activeFilter);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBooking = async (eventTitle: string, eventDate: string, eventTime: string, eventLocation: string, eventPrice: string) => {
    if (!name || !email) {
      showToast("Please enter name & email first", "error");
      return;
    }

    setLoading(true);

    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, event: eventTitle, date: eventDate, time: eventTime, location: eventLocation, price: eventPrice }),
      });

      setAnimatingEvent(eventTitle);
      setTimeout(() => setAnimatingEvent(""), 500);

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.title === eventTitle && event.seats > 0
            ? { ...event, seats: event.seats - 1 }
            : event
        )
      );

      showToast(`🎉 Booked for ${eventTitle}!`, "success");
      setSelectedEvent(eventTitle);
    } catch (err) {
      console.error(err);
      showToast("❌ Booking failed. Try again.", "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-8">

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-medium animate-slide-in
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide">
        🎟️ RESERVA
      </h1>

      {/* User Input */}
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
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 py-3 rounded-lg font-semibold"
        >
          {loading ? "Processing..." : "Select Event Below"}
        </button>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${activeFilter === cat ? FILTER_ACTIVE : FILTER_INACTIVE}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {filteredEvents.map((event, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg
            hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30
            transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-500"
          >
            {/* Category + Almost Full badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[event.category]}`}>
                {event.category}
              </span>
              {event.seats > 0 && event.seats <= 10 && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-medium animate-pulse">
                  🔥 Almost Full
                </span>
              )}
            </div>

            <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
            <p className="text-gray-300 mb-1">{event.artist}</p>
            <p className="text-gray-400 text-sm mb-1">📍 {event.location}</p>
            <p className="text-gray-400 text-sm mb-1">📅 {event.date} &nbsp; 🕐 {event.time}</p>

            {/* Countdown */}
            <p className="text-blue-300 text-xs mb-3 font-medium">⏳ {getCountdown(event.date)}</p>

            <p className="mb-2 font-semibold">{event.price}</p>

            {/* Seat count with pop animation */}
            <p className={`mb-2 text-sm ${event.seats <= 10 ? "text-red-400" : "text-green-400"}`}>
              <span
                key={`${event.title}-${event.seats}`}
                className={animatingEvent === event.title ? "inline-block animate-seat-pop" : "inline-block"}
              >
                {event.seats}
              </span>{" "}
              seats left
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(event.seats / event.maxSeats) * 100}%` }}
              />
            </div>

            <button
              onClick={() => handleBooking(event.title, event.date, event.time, event.location, event.price)}
              disabled={loading || event.seats === 0}
              className={`w-full py-2 rounded-lg transition-all duration-200
              ${selectedEvent === event.title ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}
              active:scale-95`}
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
