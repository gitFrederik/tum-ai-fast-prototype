"use client";

import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Heart, X, Star, MapPin, Syringe, Shield, MessageCircle, User, Search, PawPrint, Edit2, ChevronRight } from "lucide-react";

// ─── Maria's profile (the logged-in user) ────────────────────────────────────
const MARIA = {
  name: "Maria",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&face",
  location: "Munich, Germany",
  pet: {
    name: "Bella",
    species: "🐕",
    breed: "Golden Retriever",
    age: "2y 3mo",
    bio: "Loves swimming, fetch, and stealing socks. Will trade kisses for snacks. 10/10 good girl.",
    tags: ["Loves fetch", "Swimmer", "Good with kids", "Energetic"],
    vaccinated: true,
    neutered: true,
    purpose: "PLAYMATE",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=800&fit=crop",
    photos: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&h=800&fit=crop",
    ],
  },
};

// ─── Other pets to discover ───────────────────────────────────────────────────
const PETS = [
  {
    id: "1",
    name: "Luna",
    species: "🐈",
    breed: "Persian",
    age: "1y 6mo",
    distance: "0.8km",
    bio: "Elegant, mysterious, secretly very playful. Will judge everyone but loves her person.",
    tags: ["Loves cuddles", "Indoor only", "Calm"],
    vaccinated: true,
    neutered: false,
    purpose: "PLAYMATE",
    photo: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=600&h=800&fit=crop",
    owner: "Sophie",
    ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Max",
    species: "🐕",
    breed: "Border Collie",
    age: "3y",
    distance: "2.5km",
    bio: "Super smart, loves agility training. Looking for an equally energetic playmate!",
    tags: ["Energetic", "Trained", "Adventure buddy"],
    vaccinated: true,
    neutered: true,
    purpose: "PLAYMATE",
    photo: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=600&h=800&fit=crop",
    owner: "Felix",
    ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Milo",
    species: "🐕",
    breed: "French Bulldog",
    age: "1y 2mo",
    distance: "1.8km",
    bio: "Snorts, snores, steals hearts. Expert at puppy eyes. Professional couch potato.",
    tags: ["Loves cuddles", "Couch potato", "Dog-friendly"],
    vaccinated: true,
    neutered: true,
    purpose: "PLAYMATE",
    photo: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=800&fit=crop",
    owner: "Anna",
    ownerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    name: "Nala",
    species: "🐈",
    breed: "Siamese",
    age: "2y",
    distance: "0.5km",
    bio: "Very vocal, very opinionated, very lovable. Talks back — guaranteed.",
    tags: ["Energetic", "Cat-friendly", "Talkative"],
    vaccinated: true,
    neutered: true,
    purpose: "BREEDING",
    photo: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=800&fit=crop",
    owner: "Lisa",
    ownerAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    name: "Coco",
    species: "🐰",
    breed: "Mini Lop",
    age: "8mo",
    distance: "3.1km",
    bio: "Tiny but full of personality. Loves binkying around the garden at full speed.",
    tags: ["Cuddly", "Good with kids", "Playful"],
    vaccinated: true,
    neutered: false,
    purpose: "ADOPTION",
    photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=800&fit=crop",
    owner: "Jonas",
    ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "6",
    name: "Rocky",
    species: "🐕",
    breed: "Husky",
    age: "4y",
    distance: "4.2km",
    bio: "Dramatic, loud, absolutely chaotic. Needs a partner in crime for hiking adventures.",
    tags: ["Adventure buddy", "Energetic", "Swimmer"],
    vaccinated: true,
    neutered: true,
    purpose: "PLAYMATE",
    photo: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&h=800&fit=crop",
    owner: "Tom",
    ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
];

const purposeColor: Record<string, string> = {
  PLAYMATE: "bg-emerald-100 text-emerald-700",
  BREEDING: "bg-purple-100 text-purple-700",
  ADOPTION: "bg-amber-100 text-amber-700",
};

type Tab = "discover" | "matches" | "profile";
type Pet = typeof PETS[0];

// ─── Swipe card ───────────────────────────────────────────────────────────────
const THRESHOLD = 80;

function SwipeCard({ pet, isTop, index, onSwipe }: {
  pet: Pet; isTop: boolean; index: number;
  onSwipe: (d: "LIKE" | "PASS" | "SUPERLIKE") => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-20, 20]);
  const likeOp = useTransform(x, [30, THRESHOLD], [0, 1]);
  const passOp = useTransform(x, [-THRESHOLD, -30], [1, 0]);
  const superOp = useTransform(y, [-THRESHOLD, -30], [1, 0]);

  if (!isTop) {
    return (
      <motion.div
        style={{ scale: 1 - index * 0.04, y: index * 10, zIndex: 10 - index }}
        className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden"
      >
        <Image src={pet.photo} alt={pet.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ x, y, rotate, zIndex: 20, cursor: "grab" }}
      drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={() => {
        if (y.get() < -THRESHOLD) onSwipe("SUPERLIKE");
        else if (x.get() > THRESHOLD) onSwipe("LIKE");
        else if (x.get() < -THRESHOLD) onSwipe("PASS");
      }}
      whileDrag={{ cursor: "grabbing" }}
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
    >
      <Image src={pet.photo} alt={pet.name} fill className="object-cover" draggable={false} priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

      <motion.div style={{ opacity: likeOp }} className="absolute top-8 left-5 z-30 border-4 border-emerald-400 rounded-xl px-3 py-1.5 rotate-[-12deg]">
        <span className="text-emerald-400 text-2xl font-black">LIKE</span>
      </motion.div>
      <motion.div style={{ opacity: passOp }} className="absolute top-8 right-5 z-30 border-4 border-red-400 rounded-xl px-3 py-1.5 rotate-[12deg]">
        <span className="text-red-400 text-2xl font-black">NOPE</span>
      </motion.div>
      <motion.div style={{ opacity: superOp }} className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 border-4 border-blue-400 rounded-xl px-3 py-1.5">
        <span className="text-blue-400 text-2xl font-black">SUPER!</span>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="flex items-end justify-between mb-1.5">
          <div>
            <h2 className="text-white text-2xl font-bold">{pet.species} {pet.name}</h2>
            <p className="text-white/70 text-sm">{pet.breed} · {pet.age}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${purposeColor[pet.purpose]}`}>
            {pet.purpose === "PLAYMATE" ? "Playmate" : pet.purpose === "BREEDING" ? "Breeding" : "Adoption"}
          </span>
        </div>
        <p className="text-white/75 text-sm mb-2 line-clamp-2">{pet.bio}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {pet.tags.map(t => (
            <span key={t} className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
        <div className="flex gap-3 text-white/60 text-xs">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pet.distance}</span>
          {pet.vaccinated && <span className="flex items-center gap-1 text-emerald-300"><Syringe className="w-3 h-3" />Vaccinated</span>}
          {pet.neutered && <span className="flex items-center gap-1 text-blue-300"><Shield className="w-3 h-3" />Neutered</span>}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Match modal ──────────────────────────────────────────────────────────────
function MatchModal({ pet, onClose, onChat }: {
  pet: Pet; onClose: () => void; onChat: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div className="max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
        <p className="text-white/50 text-xs uppercase tracking-widest mb-1">It&apos;s a</p>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 mb-2">Match!</h1>
        <p className="text-white/50 text-sm mb-8">Bella and {pet.name} liked each other 🎉</p>

        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-rose-400 shadow-xl">
            <Image src={MARIA.pet.photo} alt="Bella" width={112} height={112} className="object-cover w-full h-full" />
          </div>
          <span className="text-4xl animate-pulse">❤️</span>
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-pink-400 shadow-xl">
            <Image src={pet.photo} alt={pet.name} width={112} height={112} className="object-cover w-full h-full" />
          </div>
        </div>

        <button onClick={onChat} className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl mb-3 transition-colors">
          Send a message 💬
        </button>
        <button onClick={onClose} className="text-white/40 text-sm hover:text-white/70 transition-colors">
          Keep swiping
        </button>
      </div>
    </motion.div>
  );
}

// ─── Discover tab ─────────────────────────────────────────────────────────────
function DiscoverTab({ onMatch }: { onMatch: (pet: Pet) => void }) {
  const [pets, setPets] = useState(PETS);

  const handleSwipe = useCallback((dir: "LIKE" | "PASS" | "SUPERLIKE") => {
    if (!pets.length) return;
    const [current, ...rest] = pets;
    setPets(rest);
    if ((dir === "LIKE" || dir === "SUPERLIKE") && Math.random() < 0.5) {
      setTimeout(() => onMatch(current), 350);
    }
  }, [pets, onMatch]);

  const visible = pets.slice(0, 3);

  return (
    <div className="flex flex-col h-full">
      {/* mini header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div>
          <p className="text-xs text-gray-400">Swiping as</p>
          <p className="font-bold text-gray-800 text-sm">🐕 Bella</p>
        </div>
        <span className="text-xs text-gray-400">Munich · 50km</span>
      </div>

      {/* stack */}
      <div className="relative flex-1 mx-4">
        {pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center text-gray-400">
            <span className="text-5xl">🐾</span>
            <p className="font-semibold">You&apos;ve seen everyone!</p>
            <button
              onClick={() => setPets(PETS)}
              className="mt-2 px-5 py-2 bg-rose-500 text-white rounded-full text-sm font-semibold hover:bg-rose-600 transition-colors"
            >
              Start over
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {[...visible].reverse().map((pet, ri) => {
              const idx = visible.length - 1 - ri;
              return (
                <SwipeCard key={pet.id} pet={pet} isTop={idx === 0} index={idx} onSwipe={handleSwipe} />
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* buttons */}
      {pets.length > 0 && (
        <div className="flex items-center justify-center gap-5 py-4">
          <button
            onClick={() => handleSwipe("PASS")}
            className="w-15 h-15 w-[60px] h-[60px] rounded-full bg-white border-2 border-gray-200 shadow-md flex items-center justify-center hover:border-red-400 hover:scale-110 active:scale-95 transition-all"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
          <button
            onClick={() => handleSwipe("SUPERLIKE")}
            className="w-[52px] h-[52px] rounded-full bg-white border-2 border-gray-200 shadow-md flex items-center justify-center hover:border-blue-400 hover:scale-110 active:scale-95 transition-all"
          >
            <Star className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => handleSwipe("LIKE")}
            className="w-[60px] h-[60px] rounded-full bg-white border-2 border-gray-200 shadow-md flex items-center justify-center hover:border-rose-400 hover:scale-110 active:scale-95 transition-all"
          >
            <Heart className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Matches tab ──────────────────────────────────────────────────────────────
const FAKE_MATCHES = [
  { pet: PETS[0], lastMsg: "Hey! Bella sounds amazing 🐾", time: "2m ago", unread: 2 },
  { pet: PETS[2], lastMsg: "Would love to arrange a playdate!", time: "1h ago", unread: 0 },
  { pet: PETS[5], lastMsg: "Rocky loves swimming too 🏊", time: "3h ago", unread: 1 },
];

function MatchesTab({ extraMatches, onOpenChat }: {
  extraMatches: Pet[];
  onOpenChat: (name: string) => void;
}) {
  const allMatches = [
    ...extraMatches.map(p => ({ pet: p, lastMsg: "You just matched! Say hi 👋", time: "just now", unread: 1 })),
    ...FAKE_MATCHES,
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      <h2 className="font-black text-xl text-gray-900 mb-4">Matches</h2>
      {allMatches.map(({ pet, lastMsg, time, unread }, i) => (
        <button
          key={i}
          onClick={() => onOpenChat(pet.name)}
          className="w-full flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-sm transition-all text-left"
        >
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden">
              <Image src={pet.photo} alt={pet.name} width={56} height={56} className="object-cover w-full h-full" />
            </div>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
              <p className="font-bold text-gray-900">{pet.species} {pet.name}</p>
              <span className="text-xs text-gray-400 shrink-0">{time}</span>
            </div>
            <p className="text-sm text-gray-400 truncate">{lastMsg}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </button>
      ))}
    </div>
  );
}

// ─── Fake chat overlay ────────────────────────────────────────────────────────
function ChatOverlay({ petName, onClose }: { petName: string; onClose: () => void }) {
  const [messages, setMessages] = useState([
    { from: "them", text: `Hey! Bella and ${petName} would make great friends 🐾` },
    { from: "me", text: "Totally agree! When are you free for a playdate?" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { from: "me", text: input.trim() }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { from: "them", text: "Sounds great! How about this weekend? 🎾" }]);
    }, 1000);
  };

  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">←</button>
        <p className="font-bold text-gray-900">{petName}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${m.from === "me" ? "bg-rose-500 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-100 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400"
        />
        <button
          onClick={send}
          className="px-4 py-2.5 bg-rose-500 text-white rounded-xl font-semibold text-sm hover:bg-rose-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ─── Profile tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  const [photoIdx, setPhotoIdx] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* owner header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-rose-400">
          <Image src={MARIA.avatar} alt="Maria" width={44} height={44} className="object-cover w-full h-full" />
        </div>
        <div>
          <p className="font-bold text-gray-900">{MARIA.name}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{MARIA.location}</p>
        </div>
        <button className="ml-auto p-2 text-gray-400 hover:text-rose-500 transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* pet photos */}
      <div className="relative h-72 bg-gray-100">
        <Image
          src={MARIA.pet.photos[photoIdx]}
          alt={MARIA.pet.name}
          fill
          className="object-cover"
        />
        {/* dot indicators */}
        <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5">
          {MARIA.pet.photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhotoIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === photoIdx ? "w-5 bg-white" : "w-3 bg-white/50"}`}
            />
          ))}
        </div>
        {/* left/right tap */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" onClick={() => setPhotoIdx(i => Math.max(0, i - 1))} />
          <div className="flex-1" onClick={() => setPhotoIdx(i => Math.min(MARIA.pet.photos.length - 1, i + 1))} />
        </div>
      </div>

      {/* pet info */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{MARIA.pet.species} {MARIA.pet.name}</h2>
            <p className="text-gray-500 text-sm">{MARIA.pet.breed} · {MARIA.pet.age}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${purposeColor[MARIA.pet.purpose]}`}>
            Playmate
          </span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">{MARIA.pet.bio}</p>

        {/* tags */}
        <div className="flex flex-wrap gap-1.5">
          {MARIA.pet.tags.map(t => (
            <span key={t} className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-medium rounded-full border border-rose-100">{t}</span>
          ))}
        </div>

        {/* badges */}
        <div className="flex gap-2">
          {MARIA.pet.vaccinated && (
            <span className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
              <Syringe className="w-3 h-3" /> Vaccinated
            </span>
          )}
          {MARIA.pet.neutered && (
            <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
              <Shield className="w-3 h-3" /> Neutered
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main demo shell ──────────────────────────────────────────────────────────
export default function DemoPage() {
  const [tab, setTab] = useState<Tab>("discover");
  const [matches, setMatches] = useState<Pet[]>([]);
  const [matchPopup, setMatchPopup] = useState<Pet | null>(null);
  const [chatPet, setChatPet] = useState<string | null>(null);

  const handleMatch = useCallback((pet: Pet) => {
    setMatches(m => [pet, ...m]);
    setMatchPopup(pet);
  }, []);

  const openChat = (name: string) => {
    setChatPet(name);
  };

  const tabs = [
    { id: "discover" as Tab, icon: Search, label: "Discover" },
    { id: "matches" as Tab, icon: Heart, label: "Matches", badge: matches.length },
    { id: "profile" as Tab, icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Phone frame */}
      <div className="relative w-full max-w-sm h-[780px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-gray-800 flex flex-col">

        {/* Status bar */}
        <div className="bg-white flex items-center justify-between px-6 pt-3 pb-1 shrink-0">
          <span className="text-xs font-semibold text-gray-800">9:41</span>
          <div className="flex items-center gap-1">
            <PawPrint className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-black text-rose-500">Pawnder</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5 items-end h-3">
              {[2,3,4,4].map((h, i) => <div key={i} className="w-1 bg-gray-800 rounded-sm" style={{ height: `${h * 3}px` }} />)}
            </div>
            <div className="w-5 h-2.5 border border-gray-800 rounded-sm ml-1 relative">
              <div className="absolute inset-0.5 right-1 bg-gray-800 rounded-xs" />
              <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-1 h-1.5 bg-gray-800 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {tab === "discover" && <DiscoverTab onMatch={handleMatch} />}
          {tab === "matches" && <MatchesTab extraMatches={matches} onOpenChat={openChat} />}
          {tab === "profile" && <ProfileTab />}

          {/* Chat overlay */}
          {chatPet && <ChatOverlay petName={chatPet} onClose={() => setChatPet(null)} />}
        </div>

        {/* Bottom nav */}
        <div className="bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-3 pt-2 shrink-0">
          {tabs.map(({ id, icon: Icon, label, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 relative transition-colors ${tab === id ? "text-rose-500" : "text-gray-400"}`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${tab === id ? "fill-rose-100" : ""}`} />
                {badge && badge > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Outside hint */}
      <div className="fixed bottom-4 left-0 right-0 text-center text-gray-400 text-xs pointer-events-none">
        Drag cards · ← Pass · → Like · ↑ Superlike · &nbsp;
        <a href="/" className="text-rose-400 pointer-events-auto hover:underline">← Back to landing</a>
      </div>

      {/* Match popup */}
      <AnimatePresence>
        {matchPopup && (
          <MatchModal
            pet={matchPopup}
            onClose={() => setMatchPopup(null)}
            onChat={() => { setMatchPopup(null); setTab("matches"); setTimeout(() => openChat(matchPopup.name), 100); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
