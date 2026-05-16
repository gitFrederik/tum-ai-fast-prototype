"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Heart, X, MapPin, Syringe, Shield,
  MessageCircle, User, Search, PawPrint,
  Edit2, ChevronRight, FileText, Skull,
  Zap, Star,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
type Energy = "low" | "medium" | "high";
type Temperament = "calm" | "playful" | "bold" | "shy";

interface Pet {
  id: string;
  name: string;
  species: string;
  speciesKey: string;
  breed: string;
  age: string;
  distance: string;
  bio: string;
  tags: string[];
  vaccinated: boolean;
  neutered: boolean;
  purpose: "PLAYMATE" | "BREEDING" | "ADOPTION";
  photo: string;
  owner: string;
  ownerAvatar: string;
  energy: Energy;
  temperament: Temperament;
}

// ─── Maria (you) ─────────────────────────────────────────────────────────────
const MARIA = {
  name: "Maria",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  location: "Munich, Germany",
  pet: {
    name: "Bella",
    species: "🐕",
    speciesKey: "DOG",
    breed: "Golden Retriever",
    age: "2y 3mo",
    energy: "high" as Energy,
    temperament: "playful" as Temperament,
    bio: "Loves swimming, fetch, and stealing socks. Will trade kisses for snacks. 10/10 good girl.",
    tags: ["Loves fetch", "Swimmer", "Good with kids", "Energetic"],
    vaccinated: true,
    neutered: true,
    purpose: "PLAYMATE" as const,
    photos: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&h=800&fit=crop",
    ],
  },
};

// ─── Pets to discover ─────────────────────────────────────────────────────────
const ALL_PETS: Pet[] = [
  {
    id: "1", name: "Luna", species: "🐈", speciesKey: "CAT",
    breed: "Persian", age: "1y 6mo", distance: "0.8km",
    bio: "Elegant, mysterious, secretly playful. Judges everyone but loves her person.",
    tags: ["Calm", "Indoor", "Cuddly"], vaccinated: true, neutered: false,
    purpose: "PLAYMATE", energy: "low", temperament: "calm",
    photo: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=600&h=800&fit=crop",
    owner: "Sophie", ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "2", name: "Max", species: "🐕", speciesKey: "DOG",
    breed: "Border Collie", age: "3y", distance: "2.5km",
    bio: "Super smart, loves agility. Looking for an equally energetic playmate!",
    tags: ["Energetic", "Trained", "Adventure"], vaccinated: true, neutered: true,
    purpose: "PLAYMATE", energy: "high", temperament: "playful",
    photo: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=600&h=800&fit=crop",
    owner: "Felix", ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: "3", name: "Milo", species: "🐕", speciesKey: "DOG",
    breed: "French Bulldog", age: "1y 2mo", distance: "1.8km",
    bio: "Snorts, snores, steals hearts. Professional couch potato.",
    tags: ["Cuddly", "Lazy", "Dog-friendly"], vaccinated: true, neutered: true,
    purpose: "PLAYMATE", energy: "low", temperament: "calm",
    photo: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=800&fit=crop",
    owner: "Anna", ownerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
  {
    id: "4", name: "Nala", species: "🐈", speciesKey: "CAT",
    breed: "Siamese", age: "2y", distance: "0.5km",
    bio: "Very vocal, very opinionated. Will talk back — guaranteed.",
    tags: ["Vocal", "Bold", "Cat-friendly"], vaccinated: true, neutered: true,
    purpose: "BREEDING", energy: "medium", temperament: "bold",
    photo: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=800&fit=crop",
    owner: "Lisa", ownerAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
  },
  {
    id: "5", name: "Coco", species: "🐰", speciesKey: "RABBIT",
    breed: "Mini Lop", age: "8mo", distance: "3.1km",
    bio: "Tiny but full of personality. Binkies at full speed.",
    tags: ["Cuddly", "Shy", "Fluffy"], vaccinated: true, neutered: false,
    purpose: "ADOPTION", energy: "medium", temperament: "shy",
    photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=800&fit=crop",
    owner: "Jonas", ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "6", name: "Rocky", species: "🐕", speciesKey: "DOG",
    breed: "Husky", age: "4y", distance: "4.2km",
    bio: "Dramatic, loud, absolutely chaotic. Needs a partner in crime.",
    tags: ["Energetic", "Loud", "Swimmer"], vaccinated: true, neutered: true,
    purpose: "PLAYMATE", energy: "high", temperament: "bold",
    photo: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&h=800&fit=crop",
    owner: "Tom", ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
];

// ─── 1. Matchmaking algorithm ─────────────────────────────────────────────────
function compatibilityScore(a: { speciesKey: string; energy: Energy; temperament: Temperament }, b: typeof MARIA.pet): number {
  let score = 0;
  // Same species = big bonus
  if (a.speciesKey === b.speciesKey) score += 35;
  // Energy match
  const eMap: Record<Energy, number> = { low: 0, medium: 1, high: 2 };
  score += Math.max(0, 25 - Math.abs(eMap[a.energy] - eMap[b.energy]) * 15);
  // Temperament compat matrix
  const compat: Record<Temperament, Temperament[]> = {
    calm: ["calm", "shy", "playful"],
    playful: ["playful", "bold", "calm"],
    bold: ["bold", "playful"],
    shy: ["shy", "calm"],
  };
  if (compat[a.temperament]?.includes(b.temperament)) score += 30;
  // Slight randomness so it feels alive
  score += Math.floor(Math.random() * 10);
  return Math.min(score, 100);
}

function getCompatLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Soul pets ✨", color: "text-emerald-400" };
  if (score >= 60) return { label: "Great match 🔥", color: "text-amber-400" };
  if (score >= 40) return { label: "Could work 🤔", color: "text-blue-400" };
  return { label: "Questionable 💀", color: "text-gray-400" };
}

// ─── 2. Hiss / growl sound ────────────────────────────────────────────────────
function playHiss() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const duration = 0.45;
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, sr * duration, sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 0.4);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hpf = ctx.createBiquadFilter();
    hpf.type = "bandpass";
    hpf.frequency.value = 3800;
    hpf.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    src.connect(hpf); hpf.connect(gain); gain.connect(ctx.destination);
    src.start(); src.stop(ctx.currentTime + duration);
  } catch { /* audio blocked */ }
}

// ─── Swipe card (LEFT only — "Smells Wrong") ─────────────────────────────────
const THRESHOLD = 75;

function SwipeCard({ pet, isTop, index, score, onSmellsWrong }: {
  pet: Pet; isTop: boolean; index: number;
  score: number; onSmellsWrong: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0], [-20, 0]);
  const smellsOp = useTransform(x, [-THRESHOLD, -30], [1, 0]);
  // 3. Ghost filter: grayscale + brightness as card drags left
  const ghostFilter = useTransform(x, [0, -THRESHOLD], [
    "grayscale(0%) brightness(1) contrast(1)",
    "grayscale(100%) brightness(0.45) contrast(1.6) sepia(0.4)",
  ]);

  const compat = getCompatLabel(score);

  if (!isTop) {
    return (
      <motion.div
        style={{ scale: 1 - index * 0.045, y: index * 11, zIndex: 10 - index }}
        className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden"
      >
        <Image src={pet.photo} alt={pet.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ x, rotate, zIndex: 20, cursor: "grab" }}
      drag="x"
      dragConstraints={{ left: 0, right: 20 }}   // resist dragging right
      dragElastic={{ left: 0.9, right: 0.05 }}
      onDragEnd={() => { if (x.get() < -THRESHOLD) onSmellsWrong(); }}
      whileDrag={{ cursor: "grabbing" }}
      exit={{ x: -500, rotate: -30, opacity: 0, transition: { duration: 0.4 } }}
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl select-none"
    >
      {/* 3. Ghost filter layer */}
      <motion.div style={{ filter: ghostFilter }} className="absolute inset-0">
        <Image src={pet.photo} alt={pet.name} fill className="object-cover" draggable={false} priority />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

      {/* "Smells Wrong" overlay */}
      <motion.div
        style={{ opacity: smellsOp }}
        className="absolute top-8 left-5 z-30 border-4 border-red-400 rounded-xl px-3 py-1.5 rotate-[-12deg] bg-black/30"
      >
        <span className="text-red-400 text-2xl font-black">SMELLS WRONG 👃</span>
      </motion.div>

      {/* Compatibility badge top-right */}
      <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
        <span className={`text-xs font-bold ${compat.color}`}>{compat.label}</span>
        <span className="text-white/50 text-xs ml-1">({score}%)</span>
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="flex items-end justify-between mb-1.5">
          <div>
            <h2 className="text-white text-2xl font-bold">{pet.species} {pet.name}</h2>
            <p className="text-white/70 text-sm">{pet.breed} · {pet.age}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              pet.purpose === "PLAYMATE" ? "bg-emerald-100/90 text-emerald-800" :
              pet.purpose === "BREEDING" ? "bg-purple-100/90 text-purple-800" :
              "bg-amber-100/90 text-amber-800"
            }`}>{pet.purpose === "PLAYMATE" ? "Playmate" : pet.purpose === "BREEDING" ? "Breeding" : "Adoption"}</span>
          </div>
        </div>
        <p className="text-white/75 text-sm mb-2 line-clamp-2">{pet.bio}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {pet.tags.map(t => <span key={t} className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{t}</span>)}
        </div>
        <div className="flex gap-3 text-white/60 text-xs items-center">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pet.distance}</span>
          <span className="flex items-center gap-1 text-gray-300">
            {pet.energy === "high" ? "⚡ High energy" : pet.energy === "medium" ? "😌 Medium" : "🛋 Chill"}
          </span>
          {pet.vaccinated && <span className="flex items-center gap-1 text-emerald-300"><Syringe className="w-3 h-3" />Vacc.</span>}
          {pet.neutered && <span className="flex items-center gap-1 text-blue-300"><Shield className="w-3 h-3" />Neutered</span>}
        </div>
      </div>
    </motion.div>
  );
}

// ─── 5. Sad Eyes Match Modal ───────────────────────────────────────────────────
function MatchModal({ pet, score, onClose, onChat }: {
  pet: Pet; score: number; onClose: () => void; onChat: () => void;
}) {
  const [phase, setPhase] = useState<"eyes" | "heart">("eyes");

  useEffect(() => {
    const t = setTimeout(() => setPhase("heart"), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm px-6"
      onClick={phase === "heart" ? onClose : undefined}
    >
      {phase === "eyes" ? (
        <div className="text-center">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-6">Despite it smelling wrong...</p>

          {/* Sad eyes portraits */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {[{ photo: MARIA.pet.photos[0], name: "Bella" }, { photo: pet.photo, name: pet.name }].map(({ photo, name }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-rose-500/50">
                  <Image src={photo} alt={name} fill className="object-cover" />
                  {/* Sad eyes SVG overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 80 40" className="w-16 h-8 sad-blink" style={{ marginTop: -8 }}>
                      {/* Left eye */}
                      <ellipse cx="22" cy="20" rx="10" ry="14" fill="rgba(0,0,0,0.85)" />
                      <ellipse cx="22" cy="20" rx="6" ry="10" fill="rgba(60,60,80,0.9)" />
                      <circle cx="25" cy="16" r="2.5" fill="white" opacity="0.7" />
                      {/* Right eye */}
                      <ellipse cx="58" cy="20" rx="10" ry="14" fill="rgba(0,0,0,0.85)" />
                      <ellipse cx="58" cy="20" rx="6" ry="10" fill="rgba(60,60,80,0.9)" />
                      <circle cx="61" cy="16" r="2.5" fill="white" opacity="0.7" />
                      {/* Tears */}
                      <ellipse cx="20" cy="33" rx="2" ry="4" fill="#60a5fa" opacity="0.8" />
                      <ellipse cx="56" cy="33" rx="2" ry="4" fill="#60a5fa" opacity="0.8" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/60 text-xs">{name}</p>
              </div>
            ))}
          </div>

          <p className="text-white/40 text-sm animate-pulse">Something is happening...</p>
        </div>
      ) : (
        <div className="text-center w-full">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">The algorithm says...</p>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 mb-1">
            MATCH!
          </h1>
          <p className="text-white/40 text-xs mb-5">({score}% compatible — your nose is wrong)</p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-rose-400 shadow-xl">
              <Image src={MARIA.pet.photos[0]} alt="Bella" fill={false} width={96} height={96} className="object-cover w-full h-full" />
            </div>
            <span className="text-4xl heart-pop">❤️</span>
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-pink-400 shadow-xl">
              <Image src={pet.photo} alt={pet.name} fill={false} width={96} height={96} className="object-cover w-full h-full" />
            </div>
          </div>

          <p className="text-white/60 text-sm mb-6">Bella and {pet.name} matched — against all odds 👃❤️</p>

          <button onClick={onChat} className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl mb-3 transition-colors">
            Message {pet.owner} 💬
          </button>
          <button onClick={onClose} className="text-white/30 text-sm hover:text-white/60 transition-colors">
            Keep sniffing
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Discover tab ─────────────────────────────────────────────────────────────
function DiscoverTab({ onMatch, onSmellsWrong }: {
  onMatch: (pet: Pet, score: number) => void;
  onSmellsWrong: (pet: Pet) => void;
}) {
  const [pets, setPets] = useState(ALL_PETS);
  const [scores] = useState(() => {
    const s: Record<string, number> = {};
    ALL_PETS.forEach(p => { s[p.id] = compatibilityScore(p, MARIA.pet); });
    return s;
  });

  const handleSmellsWrong = useCallback(() => {
    if (!pets.length) return;
    const [current, ...rest] = pets;
    playHiss();
    onSmellsWrong(current);
    setPets(rest);
    const sc = scores[current.id] ?? 50;
    // High compatibility → auto-match anyway (the algorithm overrides your nose)
    if (sc >= 65 && Math.random() < sc / 100) {
      setTimeout(() => onMatch(current, sc), 500);
    }
  }, [pets, scores, onMatch, onSmellsWrong]);

  const visible = pets.slice(0, 3);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-2 pb-1.5 shrink-0">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Swiping as</p>
          <p className="font-bold text-gray-800 text-sm">🐕 Bella</p>
        </div>
        <p className="text-xs text-gray-400">{pets.length} pets nearby</p>
      </div>

      {/* Ghost graveyard strip */}
      <div id="ghost-strip" className="px-3 min-h-[1px]" />

      {/* Stack */}
      <div className="relative flex-1 mx-3">
        {pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center text-gray-400">
            <span className="text-5xl">💀</span>
            <p className="font-bold text-gray-700">Everyone smelled wrong.</p>
            <p className="text-sm">Bella has high standards.</p>
            <button onClick={() => setPets(ALL_PETS)} className="mt-2 px-5 py-2 bg-rose-500 text-white rounded-full text-sm font-semibold hover:bg-rose-600 transition-colors">
              New batch of suspects
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {[...visible].reverse().map((pet, ri) => {
              const idx = visible.length - 1 - ri;
              return (
                <SwipeCard key={pet.id} pet={pet} isTop={idx === 0} index={idx}
                  score={scores[pet.id] ?? 50} onSmellsWrong={handleSmellsWrong} />
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Single action: Smells Wrong */}
      {pets.length > 0 && (
        <div className="flex items-center justify-center py-4 shrink-0">
          <button
            onClick={handleSmellsWrong}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 active:scale-95 text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl transition-all"
          >
            <X className="w-5 h-5 text-red-400" />
            SMELLS WRONG
            <span className="text-lg">👃</span>
          </button>
        </div>
      )}

      <p className="text-[10px] text-gray-400 text-center pb-2">← Drag left or tap button · Only one option exists</p>
    </div>
  );
}

// ─── Matches tab ──────────────────────────────────────────────────────────────
const SEED_MATCHES = [
  { pet: ALL_PETS[1], score: 82, time: "2m ago", msg: "Bella seems amazing! Playdate? 🐾", unread: 2 },
  { pet: ALL_PETS[2], score: 55, time: "1h ago", msg: "Our dogs should meet!", unread: 0 },
  { pet: ALL_PETS[5], score: 71, time: "3h ago", msg: "Rocky loves swimming too 🏊", unread: 1 },
];

function MatchesTab({ liveMatches, onOpenChat }: {
  liveMatches: { pet: Pet; score: number }[];
  onOpenChat: (name: string) => void;
}) {
  const all = [
    ...liveMatches.map(m => ({ pet: m.pet, score: m.score, time: "just now", msg: "You matched! Say hi 👋", unread: 1 })),
    ...SEED_MATCHES,
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      <h2 className="font-black text-xl text-gray-900">Matches</h2>
      <p className="text-xs text-gray-400 -mt-1">Despite your nose, the algorithm shipped it.</p>
      {all.map(({ pet, score, time, msg, unread }, i) => (
        <button key={i} onClick={() => onOpenChat(pet.name)}
          className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-sm transition-all text-left">
          <div className="relative shrink-0">
            <div className="w-13 h-13 w-[52px] h-[52px] rounded-full overflow-hidden">
              <Image src={pet.photo} alt={pet.name} width={52} height={52} className="object-cover w-full h-full" />
            </div>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{unread}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
              <p className="font-bold text-gray-900 text-sm">{pet.species} {pet.name}</p>
              <span className="text-[10px] text-gray-400 shrink-0">{time}</span>
            </div>
            <p className="text-xs text-gray-400 truncate">{msg}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] text-amber-500 font-semibold">{score}% match</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </button>
      ))}
    </div>
  );
}

// ─── Chat overlay ─────────────────────────────────────────────────────────────
function ChatOverlay({ petName, onClose }: { petName: string; onClose: () => void }) {
  const [msgs, setMsgs] = useState([
    { from: "them", text: `Hey! Your dog and ${petName} would be great friends 🐾` },
    { from: "me", text: "Honestly I thought they smelled wrong but here we are 😂" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, { from: "me", text: input.trim() }]);
    setInput("");
    setTimeout(() => setMsgs(m => [...m, { from: "them", text: "Haha! Playdate this weekend? 🎾" }]), 900);
  };

  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
        <button onClick={onClose} className="text-gray-400 text-xl leading-none">←</button>
        <p className="font-bold text-gray-900 text-sm">Chat · {petName}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.from === "me" ? "bg-rose-500 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-100 flex gap-2 shrink-0">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
        <button onClick={send} className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors">→</button>
      </div>
    </div>
  );
}

// ─── Profile tab ──────────────────────────────────────────────────────────────
function ProfileTab({ rejected }: { rejected: Pet[] }) {
  const [photoIdx, setPhotoIdx] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2.5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-rose-400">
          <Image src={MARIA.avatar} alt="Maria" width={40} height={40} className="object-cover w-full h-full" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{MARIA.name}</p>
          <p className="text-[10px] text-gray-400 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{MARIA.location}</p>
        </div>
        <Edit2 className="w-4 h-4 text-gray-300 ml-auto" />
      </div>

      <div className="relative h-64 bg-gray-100">
        <Image src={MARIA.pet.photos[photoIdx]} alt="Bella" fill className="object-cover" />
        <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5">
          {MARIA.pet.photos.map((_, i) => (
            <button key={i} onClick={() => setPhotoIdx(i)} className={`h-1.5 rounded-full transition-all ${i === photoIdx ? "w-5 bg-white" : "w-3 bg-white/50"}`} />
          ))}
        </div>
        <div className="absolute inset-0 flex">
          <div className="flex-1" onClick={() => setPhotoIdx(i => Math.max(0, i - 1))} />
          <div className="flex-1" onClick={() => setPhotoIdx(i => Math.min(MARIA.pet.photos.length - 1, i + 1))} />
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">🐕 {MARIA.pet.name}</h2>
            <p className="text-gray-500 text-sm">{MARIA.pet.breed} · {MARIA.pet.age}</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Playmate</span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{MARIA.pet.bio}</p>
        <div className="flex flex-wrap gap-1.5">
          {MARIA.pet.tags.map(t => <span key={t} className="px-2.5 py-1 bg-rose-50 text-rose-600 text-xs font-medium rounded-full border border-rose-100">{t}</span>)}
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full"><Syringe className="w-3 h-3" />Vaccinated</span>
          <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full"><Shield className="w-3 h-3" />Neutered</span>
          <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full"><Zap className="w-3 h-3" />High energy</span>
        </div>

        {/* Rejected pile */}
        {rejected.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1.5"><Skull className="w-3 h-3" />Smelled wrong to Bella ({rejected.length})</p>
            <div className="flex gap-1.5 flex-wrap">
              {rejected.map(p => (
                <div key={p.id} className="w-10 h-10 rounded-full overflow-hidden opacity-40 grayscale ring-1 ring-gray-300" title={p.name}>
                  <Image src={p.photo} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 6. Love Life Dossier ──────────────────────────────────────────────────────
const DOSSIER_EVENTS = [
  { time: "Today 9:41", icon: "💀", text: "Rejected Rocky (Husky). Reason: smells wrong.", score: 71 },
  { time: "Today 9:39", icon: "❤️", text: "Algorithm matched Bella with Max despite objections.", score: 82 },
  { time: "Today 9:35", icon: "💀", text: "Rejected Luna (Persian). 'Not my vibe.'", score: 42 },
  { time: "Yesterday", icon: "💬", text: "3 messages exchanged with Felix about Max.", score: null },
  { time: "2 days ago", icon: "❤️", text: "Matched with Milo. Chemistry score: 55%.", score: 55 },
  { time: "Last week", icon: "💀", text: "Mass rejection event. 6 pets in 4 minutes.", score: null },
];

function DossierTab({ matches, rejected }: { matches: { pet: Pet; score: number }[]; rejected: Pet[] }) {
  const totalMatches = matches.length + SEED_MATCHES.length;
  const totalRejected = rejected.length + 3;
  const avgScore = totalMatches > 0
    ? Math.round([...matches.map(m => m.score), ...SEED_MATCHES.map(m => m.score)].reduce((a, b) => a + b, 0) / totalMatches)
    : 0;

  return (
    <div className="flex-1 overflow-y-auto relative bg-gray-950 text-green-400 font-mono">
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines z-0 pointer-events-none" />

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="text-center mb-4 border border-green-800 rounded-xl p-3 bg-black/40">
          <p className="text-[10px] text-green-600 uppercase tracking-widest">CLASSIFIED · PAWNDER INTEL</p>
          <h2 className="text-xl font-black text-green-300 mt-1">BELLA'S SECRET LOVE LIFE</h2>
          <p className="text-xs text-green-600 mt-1 italic">"Your dog has been busy." — The Algorithm</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "MATCHES", value: totalMatches, icon: "❤️", color: "text-rose-400" },
            { label: "REJECTED", value: totalRejected, icon: "👃", color: "text-red-400" },
            { label: "AVG COMPAT", value: `${avgScore}%`, icon: "🧬", color: "text-amber-400" },
          ].map(s => (
            <div key={s.label} className="bg-black/50 border border-green-900 rounded-xl p-2 text-center">
              <p className="text-lg">{s.icon}</p>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[9px] text-green-700 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Compatibility breakdown */}
        <div className="bg-black/40 border border-green-900 rounded-xl p-3 mb-4">
          <p className="text-[10px] text-green-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Star className="w-3 h-3" /> Top Matches by Algorithm
          </p>
          {[...matches, ...SEED_MATCHES].sort((a, b) => b.score - a.score).slice(0, 3).map(({ pet, score }, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-green-800">
                <Image src={pet.photo} alt={pet.name} width={32} height={32} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <span className="text-xs text-green-300 font-bold">{pet.name}</span>
                  <span className="text-xs text-amber-400 font-bold">{score}%</span>
                </div>
                <div className="w-full h-1 bg-green-900 rounded-full mt-0.5">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: `${score}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-black/40 border border-green-900 rounded-xl p-3 mb-4">
          <p className="text-[10px] text-green-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <FileText className="w-3 h-3" /> Activity Log
          </p>
          <div className="space-y-2.5">
            {DOSSIER_EVENTS.map((e, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-sm shrink-0 mt-0.5">{e.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-green-700">{e.time}</p>
                  <p className="text-xs text-green-400">{e.text}</p>
                </div>
                {e.score && (
                  <span className="text-[10px] text-amber-500 shrink-0 font-bold">{e.score}%</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Verdict */}
        <div className="bg-rose-950/50 border border-rose-800 rounded-xl p-3 text-center">
          <p className="text-[10px] text-rose-600 uppercase tracking-widest mb-1">ALGORITHMIC VERDICT</p>
          <p className="text-sm text-rose-300 font-bold italic">
            &ldquo;Bella rejects {totalRejected} candidates on smell alone.<br />
            Yet her heart betrays her {totalMatches} times.<br />
            The nose lies. The algorithm does not.&rdquo;
          </p>
          <p className="text-[10px] text-rose-700 mt-2">— Pawnder Intelligence Unit</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main demo shell ──────────────────────────────────────────────────────────
type Tab = "discover" | "matches" | "profile" | "dossier";

export default function DemoPage() {
  const [tab, setTab] = useState<Tab>("discover");
  const [matches, setMatches] = useState<{ pet: Pet; score: number }[]>([]);
  const [rejected, setRejected] = useState<Pet[]>([]);
  const [matchPopup, setMatchPopup] = useState<{ pet: Pet; score: number } | null>(null);
  const [chatPet, setChatPet] = useState<string | null>(null);
  const newMatchCount = useRef(0);

  const handleMatch = useCallback((pet: Pet, score: number) => {
    setMatches(m => [{ pet, score }, ...m]);
    newMatchCount.current += 1;
    setMatchPopup({ pet, score });
  }, []);

  const handleSmellsWrong = useCallback((pet: Pet) => {
    setRejected(r => [pet, ...r]);
  }, []);

  const tabs = [
    { id: "discover" as Tab, icon: Search, label: "Discover" },
    { id: "matches" as Tab, icon: Heart, label: "Matches", badge: matches.length },
    { id: "profile" as Tab, icon: User, label: "Profile" },
    { id: "dossier" as Tab, icon: FileText, label: "Dossier" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50 flex items-center justify-center p-4">

      {/* Phone frame */}
      <div className="relative w-full max-w-sm h-[820px] bg-white rounded-[44px] shadow-2xl overflow-hidden border-[5px] border-gray-800 flex flex-col">

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-800 rounded-b-2xl z-30 flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-700" />
          <div className="w-12 h-2 rounded-full bg-gray-700" />
        </div>

        {/* Status bar */}
        <div className="bg-white flex items-center justify-between px-6 pt-9 pb-1.5 shrink-0 z-20">
          <span className="text-xs font-semibold text-gray-800">9:41</span>
          <div className="flex items-center gap-1.5">
            <PawPrint className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-xs font-black text-rose-500 tracking-tight">Pawnder</span>
          </div>
          <div className="flex items-center gap-0.5">
            {[2, 3, 4, 4].map((h, i) => (
              <div key={i} className="w-[3px] bg-gray-800 rounded-sm" style={{ height: h * 3 }} />
            ))}
            <div className="w-5 h-2.5 border border-gray-800 rounded-sm ml-1.5 relative">
              <div className="absolute inset-[2px] right-1 bg-gray-800 rounded-[1px]" />
              <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[3px] h-1.5 bg-gray-800 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {tab === "discover" && <DiscoverTab onMatch={handleMatch} onSmellsWrong={handleSmellsWrong} />}
          {tab === "matches" && <MatchesTab liveMatches={matches} onOpenChat={setChatPet} />}
          {tab === "profile" && <ProfileTab rejected={rejected} />}
          {tab === "dossier" && <DossierTab matches={matches} rejected={rejected} />}

          {/* Chat overlay */}
          {chatPet && <ChatOverlay petName={chatPet} onClose={() => setChatPet(null)} />}

          {/* Match popup */}
          <AnimatePresence>
            {matchPopup && (
              <MatchModal
                pet={matchPopup.pet}
                score={matchPopup.score}
                onClose={() => setMatchPopup(null)}
                onChat={() => { setMatchPopup(null); setTab("matches"); setTimeout(() => setChatPet(matchPopup.pet.name), 150); }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Bottom nav */}
        <div className="bg-white border-t border-gray-100 flex items-center justify-around px-1 pb-4 pt-2 shrink-0">
          {tabs.map(({ id, icon: Icon, label, badge }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 relative transition-colors ${tab === id ? "text-rose-500" : "text-gray-400"}`}
            >
              <div className="relative">
                <Icon className={`w-[18px] h-[18px] ${tab === id ? "fill-rose-100 stroke-rose-500" : ""}`} strokeWidth={tab === id ? 2.5 : 1.8} />
                {badge && badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-black">{badge}</span>
                ) : null}
              </div>
              <span className="text-[9px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Outside caption */}
      <div className="fixed bottom-3 left-0 right-0 text-center text-xs text-gray-400 pointer-events-none">
        ← Drag left to reject · Only "Smells Wrong" exists as a choice · &nbsp;
        <a href="/" className="text-rose-400 pointer-events-auto hover:underline">← Landing page</a>
      </div>
    </div>
  );
}
