"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase.from("events").select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      alert("Error loading events");
    } else {
      setEvents(data || []);
    }
  }

  async function handleBooking(event: any) {
    if (!name || !email) {
      alert("Enter name & email");
      return;
    }

    if (event.seats <= 0) {
      alert("No seats left");
      return;
    }

    // Save booking
    const { error } = await supabase.from("bookings").insert([
      {
        name,
        email,
        event_name: event.name,
      },
    ]);

    if (error) {
      alert("Booking failed");
      return;
    }

    // Reduce seats
    await supabase
      .from("events")
      .update({ seats: event.seats - 1 })
      .eq("id", event.id);

    // Send email
    await fetch("/api/send", {
      method: "POST",
      body: JSON.stringify({
        email,
        name,
        event: event.name,
      }),
    });

    alert("Booking confirmed 🎉");

    fetchEvents();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          🎟️ Premium Events
        </h1>

        {/* INPUT */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl mb-8 shadow-xl">
          <input
            placeholder="Your Name"
            className="w-full mb-3 p-3 rounded-lg bg-black/40"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Your Email"
            className="w-full p-3 rounded-lg bg-black/40"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* EVENTS */}
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              <h2 className="text-2xl font-semibold">{event.name}</h2>
              <p className="text-gray-400 mt-1">{event.person}</p>

              <div className="mt-4 text-sm space-y-1">
                <p>📅 {event.date}</p>
                <p>⏰ {event.time}</p>
                <p>💰 {event.price}</p>
                <p>🎫 Seats left: {event.seats}</p>
              </div>

              <button
                onClick={() => handleBooking(event)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}