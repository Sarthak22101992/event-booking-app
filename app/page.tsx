"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import PaymentModal from "@/components/PaymentModal";
import { useLang } from "@/lib/LanguageContext";

const CATEGORY_COLORS: Record<string, string> = {
  Music:         "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  Tech:          "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  Business:      "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  Sports:        "bg-green-500/20 text-green-300 border border-green-500/30",
  Comedy:        "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  Food:          "bg-pink-500/20 text-pink-300 border border-pink-500/30",
  AI:            "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  Arts:          "bg-rose-500/20 text-rose-300 border border-rose-500/30",
  Wellness:      "bg-teal-500/20 text-teal-300 border border-teal-500/30",
  Fashion:       "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30",
  Film:          "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  Education:     "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
  Gaming:        "bg-lime-500/20 text-lime-300 border border-lime-500/30",
  Travel:        "bg-sky-500/20 text-sky-300 border border-sky-500/30",
};

const CATEGORY_ACCENT: Record<string, string> = {
  Music:     "#a855f7",
  Tech:      "#3b82f6",
  Business:  "#eab308",
  Sports:    "#22c55e",
  Comedy:    "#f97316",
  Food:      "#ec4899",
  AI:        "#06b6d4",
  Arts:      "#f43f5e",
  Wellness:  "#14b8a6",
  Fashion:   "#d946ef",
  Film:      "#f59e0b",
  Education: "#6366f1",
  Gaming:    "#84cc16",
  Travel:    "#0ea5e9",
};

const CATEGORY_EMOJI: Record<string, string> = {
  Music:     "🎵",
  Tech:      "💻",
  Business:  "💼",
  Sports:    "🏆",
  Comedy:    "😂",
  Food:      "🍽️",
  AI:        "🤖",
  Arts:      "🎨",
  Wellness:  "🧘",
  Fashion:   "👗",
  Film:      "🎬",
  Education: "📚",
  Gaming:    "🎮",
  Travel:    "✈️",
};

const CATEGORY_IMAGE: Record<string, string> = {
  Music:     "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
  Tech:      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  Business:  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80",
  Sports:    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
  Comedy:    "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600&q=80",
  Food:      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  AI:        "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
  Arts:      "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&q=80",
  Wellness:  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80",
  Fashion:   "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  Film:      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
  Education: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
  Gaming:    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
  Travel:    "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80",
};


const FILTER_ACTIVE   = "bg-blue-600 text-white";
const FILTER_INACTIVE = "bg-white/10 text-gray-300 hover:bg-white/20";
const CATEGORIES      = ["All", "Music", "Tech", "Business", "Sports", "Comedy", "Food", "AI", "Arts", "Wellness", "Fashion", "Film", "Education", "Gaming", "Travel"];

const CATEGORY_LABELS: Record<string, { en: string; nl: string }> = {
  All:      { en: "All",      nl: "Alles"    },
  Music:    { en: "Music",    nl: "Muziek"   },
  Tech:     { en: "Tech",     nl: "Tech"     },
  Business: { en: "Business", nl: "Business" },
  Sports:   { en: "Sports",   nl: "Sport"    },
  Comedy:    { en: "Comedy",    nl: "Comedy"      },
  Food:      { en: "Food",      nl: "Eten"        },
  AI:        { en: "AI",        nl: "AI"          },
  Arts:      { en: "Arts",      nl: "Kunst"       },
  Wellness:  { en: "Wellness",  nl: "Welzijn"     },
  Fashion:   { en: "Fashion",   nl: "Mode"        },
  Film:      { en: "Film",      nl: "Film"        },
  Education: { en: "Education", nl: "Educatie"    },
  Gaming:    { en: "Gaming",    nl: "Gaming"      },
  Travel:    { en: "Travel",    nl: "Reizen"      },
};

const EVENT_DESCRIPTION: Record<string, { en: string; nl: string }> = {
  // Music
  "DJ Night":           { en: "Lose yourself in a night of infectious beats and electric energy. Amsterdam's hottest DJ takes the decks — doors open, inhibitions close.", nl: "Verlies jezelf in een nacht vol aanstekelijke beats en elektrische energie. Amsterdam's hotste DJ aan de draaitafels — deuren open, remmingen dicht." },
  "Live Band":          { en: "Raw. Loud. Unforgettable. Experience the power of live music in an intimate venue where every chord hits you in the chest.", nl: "Rauw. Hard. Onvergetelijk. Beleef de kracht van livemuziek in een intieme zaal waar elk akkoord je raakt." },
  "Jazz Evening":       { en: "Sip your drink, close your eyes, and let the smooth sounds of jazz carry you somewhere beautiful. Dress code: timeless.", nl: "Neem een slokje, sluit je ogen en laat de soepele klanken van jazz je meenemen naar iets moois. Dresscode: tijdloos." },
  "Classical Night":    { en: "An evening of pure musical mastery. World-class performers bring Beethoven, Mozart and more to life in breathtaking fashion.", nl: "Een avond van pure muzikale meesterschap. Wereldklasse uitvoerders brengen Beethoven, Mozart en meer tot leven." },
  "EDM Festival":       { en: "The biggest EDM spectacle of the year. Laser shows, pyrotechnics, and six stages of non-stop electronic mayhem. Are you ready?", nl: "Het grootste EDM-spektakel van het jaar. Lasershow, vuurwerk en zes podia vol onafgebroken electronic chaos. Ben jij klaar?" },
  "Hip Hop Night":      { en: "From the streets to the stage — an explosive evening of hip hop, rap and raw lyricism that'll have you on your feet all night.", nl: "Van de straat naar het podium — een explosieve avond hip hop, rap en rauw lyrisme die je de hele nacht op de been houdt." },
  // Tech
  "Web3 Summit":        { en: "Builders, founders and visionaries converge to shape the decentralised internet. Expect bold ideas, live demos, and zero hype — just substance.", nl: "Bouwers, oprichters en visionairs komen samen om het gedecentraliseerde internet vorm te geven. Verwacht gedurfde ideeën en live demo's." },
  "Startup Pitch":      { en: "Six startups. Five minutes each. One shot at glory. Watch ambitious founders battle it out for investment in this high-stakes pitch night.", nl: "Zes startups. Vijf minuten elk. Eén kans op roem. Zie ambitieuze oprichters strijden om investering in deze spannende pitch-avond." },
  "Dev Conference":     { en: "Three tracks, 20+ talks and hands-on workshops covering the tools shaping tomorrow's software. Level up, ship faster.", nl: "Drie tracks, 20+ talks en praktische workshops over de tools die de software van morgen vormgeven. Level up, sneller lanceren." },
  "Cloud Summit":       { en: "Architecture at scale, cost optimisation, and the future of infrastructure — a must-attend for every engineer pushing production systems.", nl: "Architectuur op schaal, kostenoptimalisatie en de toekomst van infrastructuur — een must voor elke engineer die productiesystemen beheert." },
  // Business
  "Leadership Forum":   { en: "The most impactful leaders in Europe share the strategies, failures and breakthroughs that defined their careers. Be in the room.", nl: "De meest invloedrijke leiders van Europa delen de strategieën, mislukkingen en doorbraken die hun carrières bepaalden. Wees erbij." },
  "Networking Night":   { en: "Skip the awkward small talk. This professionally curated networking evening connects you with the right people in 60 minutes flat.", nl: "Sla de ongemakkelijke praatjes over. Dit professioneel gecureerde netwerkevenement verbindt je met de juiste mensen in 60 minuten." },
  "Investment Summit":  { en: "Deal flow, portfolio strategy and emerging markets — where Europe's top investors talk candidly about where the real money is moving.", nl: "Deal flow, portfoliostrategie en opkomende markten — waar Europa's topinvesteerders openhartig praten over waar het echte geld naartoe gaat." },
  // Sports
  "F1 Watch Party":     { en: "Giant screens, thunderous engines and 300km/h drama — watch the race the way it was meant to be watched. With a crowd going absolutely wild.", nl: "Gigantische schermen, donderende motoren en drama op 300km/u — bekijk de race zoals het hoort. Met een volledig uitgelaten menigte." },
  "Football Match":     { en: "Ninety minutes. Two teams. One winner. Feel the raw passion of Dutch football from the stands — scarves, chants and all.", nl: "Negentig minuten. Twee teams. Één winnaar. Voel de rauwe passie van Nederlands voetbal — sjaals, gezangen en al het andere." },
  "Marathon":           { en: "42km of grit, glory and personal triumph. Whether you're racing for a PB or just to finish — Amsterdam's streets will carry you home.", nl: "42km van doorzettingsvermogen, glorie en persoonlijke triomf. Of je nu voor een PR gaat of gewoon de finish haalt — Amsterdam draagt je." },
  // Comedy
  "Stand-Up Night":     { en: "Warning: side-splitting laughter may cause shortness of breath. Three of the sharpest comedians in the Netherlands — one hilarious night.", nl: "Waarschuwing: slappe lach kan kortademigheid veroorzaken. Drie van de scherpste comedians van Nederland — één hilarische avond." },
  "Roast Night":        { en: "No topic is off-limits. No ego is safe. The most savage comedy format on earth returns — bring your thickest skin and loudest laugh.", nl: "Geen onderwerp is taboe. Geen ego is veilig. Het meest genadeloze comedyformat ter wereld is terug — kom met een dikke huid en harde lach." },
  "Improv Show":        { en: "Completely unscripted. Wildly unpredictable. The audience drives the story — and anything can happen. Literally anything.", nl: "Volledig ongeschreven. Volledig onvoorspelbaar. Het publiek bepaalt het verhaal — en alles kan gebeuren. Letterlijk alles." },
  // Food
  "Wine & Dine Evening": { en: "A culinary journey paired with exceptional wines. Each course tells a story — from the vineyard to your plate, expertly guided by a sommelier.", nl: "Een culinaire reis gepaard met uitzonderlijke wijnen. Elk gerecht vertelt een verhaal — van de wijngaard tot je bord, begeleid door een sommelier." },
  "Food Festival":      { en: "Fifty food vendors, one epic location. Street food, gourmet bites and everything in between — come hungry, leave amazed.", nl: "Vijftig foodkramen, één epische locatie. Street food, gourmetgerechten en alles daartussenin — kom hongerig, vertrek verbaasd." },
  "Chef's Table":       { en: "A once-in-a-season private dining experience. Eight courses, one Michelin-starred chef, and twelve seats that go faster than you'd think.", nl: "Een eenmalige privé-dinerervaring. Acht gangen, één Michelin-ster chef, en twaalf plekken die sneller weg zijn dan je denkt." },
  "Neon Rave":          { en: "Blacklights, neon paint and the kind of music that vibrates through your whole body. This isn't a party — it's a full sensory experience.", nl: "Zwartlichten, neonverf en muziek die door je hele lichaam trilt. Dit is geen feest — het is een volledig zintuiglijke ervaring." },
  // AI
  "AI Talk":            { en: "The world's smartest minds on AI gather for one evening of provocative ideas, honest debate and the conversations the tech press won't print.", nl: "De slimste AI-geesten ter wereld komen samen voor een avond vol provocerende ideeën, eerlijk debat en gesprekken die de techpers niet drukt." },
  "AI & Future of Work": { en: "Jobs, skills and the economy are being rewritten in real time. This is where smart professionals get ahead of the curve — not behind it.", nl: "Banen, vaardigheden en de economie worden herschreven. Hier blijven slimme professionals voorlopen op de curve — niet erachter." },
  "Machine Learning Day": { en: "From theory to deployment: a deep-dive day for practitioners who want to build better models, faster pipelines and smarter systems.", nl: "Van theorie naar implementatie: een verdiepingsdag voor beoefenaars die betere modellen, snellere pipelines en slimmere systemen willen bouwen." },
  "ChatGPT Workshop":   { en: "Hands-on. Practical. No buzzwords. Walk away knowing exactly how to apply large language models to your actual workflow — today.", nl: "Hands-on. Praktisch. Geen buzzwords. Vertrek met exacte kennis van hoe je grote taalmodellen toepast in je dagelijkse workflow — vanaf vandaag." },
  "Robotics Expo":      { en: "See tomorrow's machines — today. From surgical robots to autonomous vehicles, the innovations on show here are already changing the world.", nl: "Zie de machines van morgen — vandaag. Van chirurgische robots tot autonome voertuigen, de innovaties hier veranderen de wereld al." },
};

function getCountdown(dateStr: string, tr: { today: string; tomorrow: string; pastEvent: string; daysAway: string }): string {
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return tr.today;
  if (diff === 1) return tr.tomorrow;
  if (diff < 0) return tr.pastEvent;
  return `${diff} ${tr.daysAway}`;
}

function parsePrice(price: string): number {
  if (price.toLowerCase() === "free") return 0;
  return parseInt(price.replace(/[^0-9]/g, "")) || 0;
}

function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  const colors = ["#a855f7","#3b82f6","#22c55e","#f97316","#ec4899","#06b6d4","#eab308"];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 100,
    size: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: Math.random() * 3 + 2,
    speedX: (Math.random() - 0.5) * 3,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 8,
  }));
  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.y += p.speedY; p.x += p.speedX; p.rot += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
    frame++;
    if (frame < 130) requestAnimationFrame(animate);
    else document.body.removeChild(canvas);
  }
  animate();
}

function SkeletonCard() {
  return (
    <div className="backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }}>
      <div className="h-20 bg-white/5" />
      <div className="p-6">
        <div className="flex gap-2 mb-4">
          <div className="h-5 w-16 rounded-full bg-white/10" />
          <div className="h-5 w-20 rounded-full bg-white/10" />
        </div>
        <div className="flex justify-between mb-3">
          <div className="h-6 w-36 rounded bg-white/10" />
          <div className="h-6 w-12 rounded-full bg-white/10" />
        </div>
        <div className="h-4 w-28 rounded bg-white/10 mb-2" />
        <div className="h-4 w-44 rounded bg-white/10 mb-2" />
        <div className="h-4 w-32 rounded bg-white/10 mb-4" />
        <div className="h-2 w-full rounded-full bg-white/10 mb-4" />
        <div className="h-9 w-full rounded-lg bg-white/10" />
      </div>
    </div>
  );
}

type Event = {
  id: number;
  title: string;
  artist: string;
  price: string;
  seats: number;
  maxSeats: number;
  date: string;
  time: string;
  location: string;
  category: string;
  image_url: string | null;
};

export default function Home() {
  const { lang, setLang, tr } = useLang();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [animatingEvent, setAnimatingEvent] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [events, setEvents] = useState<Event[]>([]);
  const [bookingCounts, setBookingCounts] = useState<Record<number, number>>({});
  const [viewingCounts, setViewingCounts] = useState<Record<number, number>>({});
  const [lastBooked, setLastBooked] = useState<Record<number, number>>({});
  const [bookedEventIds, setBookedEventIds] = useState<Set<number>>(new Set());
  const [showPast, setShowPast] = useState(false);
  const [shakeField, setShakeField] = useState<"name" | "email" | null>(null);
  const [pendingEvent, setPendingEvent] = useState<Event | null>(null);
  const [paymentEvent, setPaymentEvent] = useState<Event | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    title: string; artist: string; location: string;
    date: string; time: string; price: string; ref: string;
  } | null>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setName(session.user.user_metadata?.full_name ?? "");
        setEmail(session.user.email ?? "");
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setName(session.user.user_metadata?.full_name ?? "");
        setEmail(session.user.email ?? "");
      } else {
        setUser(null);
        setName("");
        setEmail("");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase.from("events").select("*").order("id");
      if (error) {
        console.error("Failed to fetch events:", error.message);
      } else {
        const mapped = data.map((e) => ({
          id: e.id, title: e.title, artist: e.artist, price: e.price,
          seats: e.seats, maxSeats: e.max_seats, date: e.date, time: e.time,
          location: e.location, category: e.category, image_url: e.image_url ?? null,
        }));
        setEvents(mapped);

        // Generate social proof numbers once per event
        const viewing: Record<number, number> = {};
        const booked: Record<number, number> = {};
        mapped.forEach((e) => {
          viewing[e.id] = Math.floor(Math.random() * 16) + 5;  // 5–20
          booked[e.id]  = Math.floor(Math.random() * 44) + 2;  // 2–45 mins ago
        });
        setViewingCounts(viewing);
        setLastBooked(booked);
      }

      const { data: bookings } = await supabase.from("bookings").select("event_id");
      if (bookings) {
        const counts: Record<number, number> = {};
        bookings.forEach((b) => { counts[b.event_id] = (counts[b.event_id] || 0) + 1; });
        setBookingCounts(counts);
      }
      setPageLoading(false);
    }
    fetchEvents();
  }, []);

  const trendingIds = new Set(
    Object.entries(bookingCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([id]) => Number(id))
  );

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const filteredEvents = events
    .filter((e) => {
      const isPast = new Date(e.date) < today;
      return showPast ? isPast : !isPast;
    })
    .filter((e) => activeFilter === "All" || e.category === activeFilter)
    .filter((e) =>
      search === "" ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.artist.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-asc")  return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === "price-desc") return parsePrice(b.price) - parsePrice(a.price);
      if (sortBy === "seats")      return b.seats - a.seats;
      if (sortBy === "city")       return a.location.localeCompare(b.location);
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);

  const handleBooking = async (
    eventId: number, eventTitle: string, eventDate: string,
    eventTime: string, eventLocation: string, eventPrice: string, currentSeats: number,
    paymentRef?: string
  ): Promise<boolean> => {
    if (!name || !email) { showToast(tr.toastNameEmail, "error"); return false; }
    if (!isValidEmail(email)) { showToast(tr.toastInvalidEmail, "error"); return false; }
    if (bookedEventIds.has(eventId)) { showToast(tr.toastAlreadyBooked, "error"); return false; }

    setLoading(true);
    try {
      const { error } = await supabase.from("events").update({ seats: currentSeats - 1 }).eq("id", eventId);
      if (error) throw error;

      await supabase.from("bookings").insert({
        event_id: eventId, event_title: eventTitle,
        name: name, email: email,
        payment_ref: paymentRef ?? null,
      });

      setBookingCounts((prev) => ({ ...prev, [eventId]: (prev[eventId] || 0) + 1 }));

      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, event: eventTitle, date: eventDate, time: eventTime, location: eventLocation, price: eventPrice }),
      });

      setAnimatingEvent(eventTitle);
      setTimeout(() => setAnimatingEvent(""), 500);
      setEvents((prev) => prev.map((e) => e.id === eventId ? { ...e, seats: currentSeats - 1 } : e));

      const bookingRef = "RES-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const artist = events.find((e) => e.id === eventId)?.artist ?? "";
      launchConfetti();
      showToast(`${tr.toastBooked} ${eventTitle}!`, "success");
      setSelectedEvent(eventTitle);
      setBookedEventIds((prev) => new Set(prev).add(eventId));
      setConfirmedBooking({ title: eventTitle, artist, location: eventLocation, date: eventDate, time: eventTime, price: eventPrice, ref: bookingRef });
      setLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      showToast(tr.toastFailed, "error");
      setLoading(false);
      return false;
    }
  };

  return (
    <div className="relative min-h-screen text-white p-8 overflow-hidden" style={{ background: "#06060f" }}>

      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb-1 absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full" style={{ background: "#7c3aed", filter: "blur(130px)" }} />
        <div className="orb-2 absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full" style={{ background: "#1d4ed8", filter: "blur(130px)" }} />
        <div className="orb-3 absolute -bottom-40 left-1/3 w-[480px] h-[480px] rounded-full" style={{ background: "#be185d", filter: "blur(150px)" }} />
        <div className="orb-4 absolute top-1/4 left-1/2 w-[300px] h-[300px] rounded-full" style={{ background: "#0e7490", filter: "blur(120px)" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      {/* Booking Form Modal */}
      {pendingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-card-enter">
            {/* Event summary */}
            <div className="mb-6">
              <div className="h-1 w-12 rounded-full mb-4" style={{ background: CATEGORY_ACCENT[pendingEvent.category] }} />
              <h2 className="text-xl font-bold text-white mb-1">{pendingEvent.title}</h2>
              <p className="text-gray-400 text-sm">{pendingEvent.artist}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                <span>📅 {pendingEvent.date}</span>
                <span>🕐 {pendingEvent.time}</span>
                <span>📍 {pendingEvent.location}</span>
              </div>
              <div className="mt-3 inline-block text-sm font-bold px-3 py-1 rounded-full"
                style={{ background: `${CATEGORY_ACCENT[pendingEvent.category]}22`, color: CATEGORY_ACCENT[pendingEvent.category], border: `1px solid ${CATEGORY_ACCENT[pendingEvent.category]}44` }}>
                {pendingEvent.price}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 mb-6" />

            {/* Form */}
            {user ? (
              <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <span className="text-green-400 text-lg">✓</span>
                <div>
                  <p className="text-green-300 text-sm font-medium">{name}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-300 text-sm mb-4 font-medium">{tr.yourDetails}</p>
                <input value={name} onChange={(e) => { setName(e.target.value); setShakeField(null); }} placeholder={tr.fullName}
                  className={`w-full p-3 mb-4 rounded-lg bg-white/10 border focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500
                    ${shakeField === "name" ? "border-red-500 animate-shake" : "border-gray-700"}`} />
                <input value={email} onChange={(e) => { setEmail(e.target.value); setShakeField(null); }} placeholder={tr.emailAddress}
                  className={`w-full p-3 mb-1 rounded-lg bg-white/10 border focus:outline-none focus:ring-2 text-white placeholder-gray-500
                    ${shakeField === "email" || (email && !isValidEmail(email)) ? "border-red-500 animate-shake focus:ring-red-500" : "border-gray-700 focus:ring-blue-500"}`} />
                {email && !isValidEmail(email) && (
                  <p className="text-red-400 text-xs mb-3 pl-1">{tr.validEmail}</p>
                )}
                {!(email && !isValidEmail(email)) && <div className="mb-4" />}
                <p className="text-gray-500 text-xs mb-4 text-center">
                  <Link href="/login" className="text-blue-400 hover:text-blue-300">{tr.signIn}</Link> {tr.signInToFill}
                </p>
              </>
            )}

            {/* Actions */}
            <button
              onClick={async () => {
                if (!user) {
                  if (!name) { setShakeField("name"); setTimeout(() => setShakeField(null), 500); return; }
                  if (!email || !isValidEmail(email)) { setShakeField("email"); setTimeout(() => setShakeField(null), 500); return; }
                }
                setPaymentEvent(pendingEvent);
                setPendingEvent(null);
              }}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all py-3 rounded-xl font-semibold mb-3">
              {loading ? tr.booking : tr.proceedToPayment}
            </button>
            <button onClick={() => { setPendingEvent(null); setName(""); setEmail(""); }}
              className="w-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all py-3 rounded-xl text-gray-400 hover:text-white font-medium">
              {tr.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentEvent && (
        <PaymentModal
          eventTitle={paymentEvent.title}
          eventDate={paymentEvent.date}
          eventTime={paymentEvent.time}
          eventLocation={paymentEvent.location}
          price={paymentEvent.price}
          name={name}
          email={email}
          onSuccess={async (paymentRef: string) => {
            setPaymentEvent(null);
            await handleBooking(paymentEvent.id, paymentEvent.title, paymentEvent.date, paymentEvent.time, paymentEvent.location, paymentEvent.price, paymentEvent.seats, paymentRef);
          }}
          onClose={() => { setPaymentEvent(null); }}
        />
      )}

      {/* Booking Confirmation Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-card-enter">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-2xl font-bold text-white">{tr.bookingConfirmed}</h2>
              <p className="text-gray-400 text-sm mt-1">{tr.confirmationSent}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 space-y-3 mb-6">
              <div className="flex justify-between items-start">
                <span className="text-gray-400 text-sm">{tr.eventLabel}</span>
                <span className="text-white font-semibold text-right">{confirmedBooking.title}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400 text-sm">{tr.artistLabel}</span>
                <span className="text-white text-right">{confirmedBooking.artist}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400 text-sm">{tr.venueLabel}</span>
                <span className="text-white text-right text-sm">{confirmedBooking.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">{tr.dateLabel}</span>
                <span className="text-white text-sm">{confirmedBooking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">{tr.timeLabel}</span>
                <span className="text-white text-sm">{confirmedBooking.time}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-gray-400 text-sm">{tr.totalPaid}</span>
                <span className="font-bold text-green-400">{confirmedBooking.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">{tr.bookingRef}</span>
                <span className="font-mono text-purple-300 text-sm">{confirmedBooking.ref}</span>
              </div>
            </div>
            <button onClick={() => setConfirmedBooking(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all py-3 rounded-xl font-semibold">
              {tr.close}
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-medium animate-slide-in
          ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}

      {/* Top bar */}
      <div className="max-w-5xl mx-auto flex justify-end mb-4">
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div className="flex rounded-lg bg-white/5 p-0.5 border border-white/10">
            <button onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${lang === "en" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
              🇬🇧 EN
            </button>
            <button onClick={() => setLang("nl")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${lang === "nl" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
              🇳🇱 NL
            </button>
          </div>
          <Link href="/help" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
            {tr.help}
          </Link>
          {user ? (
            <>
              <span className="text-gray-600 hidden sm:block">|</span>
              <span className="text-gray-400 text-sm hidden sm:block">{user.email}</span>
              <Link href="/my-bookings" className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                {tr.myBookings}
              </Link>
              <button onClick={() => supabase.auth.signOut()}
                className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                {tr.signOut}
              </button>
            </>
          ) : (
            <Link href="/login"
              className="text-sm font-medium px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
              {tr.signIn}
            </Link>
          )}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-12 max-w-5xl mx-auto"
        style={{ minHeight: "280px", background: "linear-gradient(135deg, #1e1b4b 0%, #1d4ed8 50%, #7c3aed 100%)" }}>
        {/* Background image overlay */}
        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80"
          alt="hero" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,10,40,0.85) 0%, rgba(10,10,40,0.4) 100%)" }} />

        <div className="relative z-10 p-10 flex flex-col justify-between h-full" style={{ minHeight: "280px" }}>
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-11 h-11 flex items-center justify-center rounded-xl shrink-0"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", boxShadow: "0 0 24px #6366f188" }}>
                <span className="text-xl select-none">🎟</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#06060f]" style={{ boxShadow: "0 0 8px #06b6d4" }} />
              </div>
              <h1 className="text-4xl font-extrabold tracking-wide text-white">RESERVA</h1>
            </div>
            <p className="text-blue-200 text-sm tracking-widest uppercase">{tr.tagline}</p>
          </div>

          {/* Search bar */}
          <div className="mt-8 flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={tr.searchPlaceholder}
                className="w-full px-5 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">✕</button>
              )}
            </div>
            <button onClick={() => eventsRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-4 rounded-2xl font-semibold text-white transition-all active:scale-95 shrink-0"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>
              {tr.search}
            </button>
          </div>
        </div>
      </div>

      {/* Filter + Sort row */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Upcoming / Past toggle */}
          <div className="flex rounded-lg bg-white/5 p-0.5 mr-2">
            <button onClick={() => setShowPast(false)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!showPast ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
              {tr.upcoming}
            </button>
            <button onClick={() => setShowPast(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${showPast ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
              {tr.past}
            </button>
          </div>
          {CATEGORIES.map((cat) => {
            const count = cat === "All" ? events.length : events.filter((e) => e.category === cat).length;
            return (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  ${activeFilter === cat ? FILTER_ACTIVE : FILTER_INACTIVE}`}>
                {CATEGORY_LABELS[cat][lang]} <span className="opacity-60 text-xs">({count})</span>
              </button>
            );
          })}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="bg-white/10 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <option value="date">{tr.sortDate}</option>
          <option value="price-asc">{tr.sortPriceAsc}</option>
          <option value="price-desc">{tr.sortPriceDesc}</option>
          <option value="seats">{tr.sortSeats}</option>
          <option value="city">{tr.sortCity}</option>
        </select>
      </div>

      {/* Event Grid */}
      {pageLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          {filteredEvents.length === 0 && (
            <div className="text-center mt-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-white font-semibold text-lg">{tr.noEventsFound}</p>
              <p className="text-gray-400 text-sm mt-1">{tr.tryDifferent}</p>
              <button onClick={() => { setSearch(""); setActiveFilter("All"); }}
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm underline">
                {tr.clearFilters}
              </button>
            </div>
          )}
          <div ref={eventsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {filteredEvents.map((event, index) => (
              <div key={event.id}
                className={`rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-2xl
                transition-all duration-300 cursor-pointer border border-white/10 animate-card-enter
                ${event.seats === 0 ? "opacity-50 grayscale" : "hover:border-white/20"}
                ${selectedEvent === event.title ? "animate-booked-glow" : ""}`}
                style={{ animationDelay: `${index * 80}ms`, background: "rgba(255,255,255,0.04)" }}>

                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.image_url ?? CATEGORY_IMAGE[event.category]}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = CATEGORY_IMAGE[event.category]; }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />
                  {/* Category emoji top-left */}
                  <div className="absolute top-3 left-3 text-2xl">{CATEGORY_EMOJI[event.category]}</div>
                  {/* Viewing count bottom-left */}
                  <div className="absolute bottom-2 left-3 text-xs text-white/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                    {viewingCounts[event.id]} {tr.peopleViewing}
                  </div>
                  {/* Last booked bottom-right */}
                  <div className="absolute bottom-2 right-3 text-xs text-white/60">
                    🕐 {tr.bookedAgo} {lastBooked[event.id]}{tr.minutesAgo}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[event.category]}`}>
                      {CATEGORY_LABELS[event.category][lang]}
                    </span>
                    {trendingIds.has(event.id) && (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-medium animate-pulse">
                        {tr.trending}
                      </span>
                    )}
                    {event.seats > 0 && event.seats / event.maxSeats < 0.1 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-medium animate-pulse">
                        {tr.almostFull}
                      </span>
                    )}
                    {event.seats === 0 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 font-medium">
                        {tr.soldOut}
                      </span>
                    )}
                  </div>

                  {/* Title + Price */}
                  <div className="flex items-start justify-between mb-1">
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <span className="text-sm font-bold px-3 py-1 rounded-full ml-2 shrink-0"
                      style={{ background: `${CATEGORY_ACCENT[event.category]}22`, color: CATEGORY_ACCENT[event.category], border: `1px solid ${CATEGORY_ACCENT[event.category]}44` }}>
                      {event.price}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-1">{event.artist}</p>
                  {EVENT_DESCRIPTION[event.title] && (
                    <p className="text-gray-500 text-xs mb-2 leading-relaxed line-clamp-2">
                      {EVENT_DESCRIPTION[event.title][lang]}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm mb-1">📍 {event.location}</p>
                  <p className="text-gray-400 text-sm mb-1">📅 {event.date} &nbsp; 🕐 {event.time}</p>
                  <p className="text-blue-300 text-xs mb-1 font-medium">⏳ {getCountdown(event.date, tr)}</p>
                  {(bookingCounts[event.id] || 0) > 0 && (
                    <p className="text-gray-400 text-xs mb-3">🎟 {bookingCounts[event.id]} {tr.booked}</p>
                  )}

                  {/* Seat count */}
                  <p className={`mb-2 text-sm ${event.seats / event.maxSeats < 0.1 ? "text-red-400" : "text-green-400"}`}>
                    <span key={`${event.title}-${event.seats}`}
                      className={animatingEvent === event.title ? "inline-block animate-seat-pop" : "inline-block"}>
                      {event.seats}
                    </span>{" "}{tr.seatsLeft}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(event.seats / event.maxSeats) * 100}%`, background: CATEGORY_ACCENT[event.category] }} />
                  </div>

                  <button
                    onClick={() => { if (event.seats > 0 && !bookedEventIds.has(event.id)) setPendingEvent(event); }}
                    disabled={loading || event.seats === 0 || bookedEventIds.has(event.id)}
                    className={`w-full py-2 rounded-lg transition-all duration-200 font-medium active:scale-95
                    ${bookedEventIds.has(event.id) ? "bg-green-700 cursor-not-allowed"
                      : event.seats === 0 ? "bg-gray-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"}`}>
                    {event.seats === 0 ? tr.soldOut
                      : bookedEventIds.has(event.id) ? tr.alreadyBooked
                      : loading ? tr.booking : tr.bookNow}
                  </button>
                  {bookedEventIds.has(event.id) && (
                    <Link href="/my-bookings" className="block text-center text-xs text-gray-500 hover:text-red-400 transition-colors mt-2">
                      {tr.cancelBooking}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="mt-24 border-t border-white/5 pt-14 pb-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}>
                <span className="text-sm">🎟</span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 border border-[#06060f]" />
              </div>
              <span className="font-bold text-white">RESERVA</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              {tr.footerTagline}
            </p>
            <p className="text-gray-500 text-xs mt-3">🌐 www.reserva.com</p>
            <p className="text-gray-500 text-xs mt-1">📞 +31 20 847 3920</p>
            <p className="text-gray-500 text-xs mt-1">📍 Keizersgracht 452-H, 1017 EG Amsterdam</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{tr.company}</h4>
            <ul className="space-y-2">
              {[
                { label: tr.aboutUs }, { label: tr.careers }, { label: tr.press },
                { label: tr.blog }, { label: tr.contact },
              ].map((item) => (
                <li key={item.label}>
                  <Link href="/help" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{tr.support}</h4>
            <ul className="space-y-2">
              {[
                { label: tr.helpCenter, href: "/help" },
                { label: tr.myBookings, href: "/my-bookings" },
                { label: tr.cancellationPolicy, href: "/help" },
                { label: tr.privacyPolicy, href: "/help" },
                { label: tr.termsOfService, href: "/help" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{tr.connectWithUs}</h4>
            <div className="flex gap-3 mb-6">
              {[
                { icon: "𝕏", label: "Twitter" },
                { icon: "in", label: "LinkedIn" },
                { icon: "f", label: "Facebook" },
                { icon: "▶", label: "YouTube" },
                { icon: "📸", label: "Instagram" },
              ].map((s) => (
                <button key={s.label} title={s.label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs font-bold">
                  {s.icon}
                </button>
              ))}
            </div>
            <h4 className="text-white text-sm font-semibold mb-3">{tr.securePayments}</h4>
            <div className="flex flex-wrap gap-2">
              {["VISA", "MC", "iDEAL", "PayPal", "Apple Pay"].map((p) => (
                <span key={p} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400 text-xs font-medium">{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">{tr.footerCopyright}</p>
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-xs">🔒</span>
            <span className="text-gray-600 text-xs">{tr.sslSecured}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
