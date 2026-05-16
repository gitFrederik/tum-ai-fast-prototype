"use client";

import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Star, MapPin, Syringe, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FAKE_PETS = [
  {
    id: "1",
    name: "Buddy",
    species: "🐕",
    breed: "Golden Retriever",
    age: "2y 3mo",
    distance: "1.2km",
    bio: "Loves fetch, cuddles, and making new friends. Will work for treats.",
    tags: ["Loves fetch", "Good with kids", "Energetic"],
    vaccinated: true,
    neutered: true,
    purpose: "PLAYMATE",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=800&fit=crop",
  },
  {
    id: "2",
    name: "Luna",
    species: "🐈",
    breed: "Persian",
    age: "1y 6mo",
    distance: "0.8km",
    bio: "Elegant, mysterious, and secretly very playful. Judges everyone but loves her people.",
    tags: ["Loves cuddles", "Indoor only", "Calm"],
    vaccinated: true,
    neutered: false,
    purpose: "PLAYMATE",
    photo: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=600&h=800&fit=crop",
  },
  {
    id: "3",
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
  },
  {
    id: "4",
    name: "Coco",
    species: "🐰",
    breed: "Mini Lop",
    age: "8mo",
    distance: "3.1km",
    bio: "Tiny but full of personality. Loves binkying around the garden.",
    tags: ["Loves cuddles", "Couch potato", "Good with kids"],
    vaccinated: true,
    neutered: false,
    purpose: "ADOPTION",
    photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=800&fit=crop",
  },
  {
    id: "5",
    name: "Milo",
    species: "🐕",
    breed: "French Bulldog",
    age: "1y 2mo",
    distance: "1.8km",
    bio: "Snorts, snores, and steals hearts. Expert at the puppy eyes.",
    tags: ["Loves cuddles", "Couch potato", "Dog-friendly"],
    vaccinated: true,
    neutered: true,
    purpose: "PLAYMATE",
    photo: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=800&fit=crop",
  },
  {
    id: "6",
    name: "Nala",
    species: "🐈",
    breed: "Siamese",
    age: "2y",
    distance: "0.5km",
    bio: "Very vocal, very opinionated, very lovable. Talks back guaranteed.",
    tags: ["Energetic", "Cat-friendly", "Adventure buddy"],
    vaccinated: true,
    neutered: true,
    purpose: "BREEDING",
    photo: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=800&fit=crop",
  },
];

const MY_PET = {
  name: "Charlie",
  species: "🐕",
  photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
};

const SWIPE_THRESHOLD = 80;

const purposeColor: Record<string, string> = {
  PLAYMATE: "bg-emerald-100 text-emerald-700",
  BREEDING: "bg-purple-100 text-purple-700",
  ADOPTION: "bg-amber-100 text-amber-700",
};

function DemoCard({
  pet,
  isTop,
  index,
  onSwipe,
}: {
  pet: (typeof FAKE_PETS)[0];
  isTop: boolean;
  index: number;
  onSwipe: (dir: "LIKE" | "PASS" | "SUPERLIKE") => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-20, 20]);
  const likeOpacity = useTransform(x, [30, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, -30], [1, 0]);
  const superOpacity = useTransform(y, [-SWIPE_THRESHOLD, -30], [1, 0]);

  const scale = 1 - index * 0.04;
  const yOffset = index * 10;

  if (!isTop) {
    return (
      <motion.div
        style={{ scale, y: yOffset, zIndex: 10 - index }}
        className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden"
      >
        <div className="relative w-full h-full">
          <Image src={pet.photo} alt={pet.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ x, y, rotate, zIndex: 20, cursor: "grab" }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={() => {
        const xv = x.get();
        const yv = y.get();
        if (yv < -SWIPE_THRESHOLD) onSwipe("SUPERLIKE");
        else if (xv > SWIPE_THRESHOLD) onSwipe("LIKE");
        else if (xv < -SWIPE_THRESHOLD) onSwipe("PASS");
      }}
      whileDrag={{ cursor: "grabbing" }}
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
    >
      <div className="relative w-full h-full">
        <Image src={pet.photo} alt={pet.name} fill className="object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Like overlay */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-6 z-30 border-4 border-emerald-400 rounded-xl px-4 py-2 rotate-[-12deg]">
          <span className="text-emerald-400 text-3xl font-black">LIKE</span>
        </motion.div>

        {/* Pass overlay */}
        <motion.div style={{ opacity: passOpacity }} className="absolute top-8 right-6 z-30 border-4 border-red-400 rounded-xl px-4 py-2 rotate-[12deg]">
          <span className="text-red-400 text-3xl font-black">NOPE</span>
        </motion.div>

        {/* Superlike overlay */}
        <motion.div style={{ opacity: superOpacity }} className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 border-4 border-blue-400 rounded-xl px-4 py-2">
          <span className="text-blue-400 text-3xl font-black">SUPER!</span>
        </motion.div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h2 className="text-white text-3xl font-bold">{pet.species} {pet.name}</h2>
              <p className="text-white/70 text-sm">{pet.breed} · {pet.age}</p>
            </div>
            <Badge className={`${purposeColor[pet.purpose]} text-xs font-semibold`}>
              {pet.purpose === "PLAYMATE" ? "Playmate" : pet.purpose === "BREEDING" ? "Breeding" : "Adoption"}
            </Badge>
          </div>
          <p className="text-white/80 text-sm mb-2 line-clamp-2">{pet.bio}</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {pet.tags.map((t) => (
              <Badge key={t} className="bg-white/20 text-white text-xs border-0">{t}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-3 text-white/60 text-xs">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pet.distance}</span>
            {pet.vaccinated && <span className="flex items-center gap-1 text-emerald-300"><Syringe className="w-3 h-3" />Vaccinated</span>}
            {pet.neutered && <span className="flex items-center gap-1 text-blue-300"><Shield className="w-3 h-3" />Neutered</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MatchModal({ pet, onClose }: { pet: (typeof FAKE_PETS)[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div className="max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">It&apos;s a</p>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 mb-2">
          Match!
        </h1>
        <p className="text-white/50 text-sm mb-8">{MY_PET.name} and {pet.name} liked each other</p>

        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-rose-400 shadow-lg">
            <Image src={MY_PET.photo} alt={MY_PET.name} width={112} height={112} className="object-cover w-full h-full" />
          </div>
          <span className="text-4xl animate-pulse">❤️</span>
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-pink-400 shadow-lg">
            <Image src={pet.photo} alt={pet.name} width={112} height={112} className="object-cover w-full h-full" />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl transition-colors mb-3"
        >
          Keep Swiping 🐾
        </button>
        <button onClick={onClose} className="text-white/40 text-sm hover:text-white/60 transition-colors">
          dismiss
        </button>
      </div>
    </motion.div>
  );
}

export default function DemoPage() {
  const [pets, setPets] = useState(FAKE_PETS);
  const [match, setMatch] = useState<(typeof FAKE_PETS)[0] | null>(null);
  const [liked, setLiked] = useState(0);
  const [passed, setPassed] = useState(0);

  const handleSwipe = useCallback((direction: "LIKE" | "PASS" | "SUPERLIKE") => {
    if (pets.length === 0) return;
    const [current, ...rest] = pets;
    setPets(rest);

    if (direction === "LIKE" || direction === "SUPERLIKE") {
      setLiked((n) => n + 1);
      // 40% chance of a match
      if (Math.random() < 0.4) {
        setTimeout(() => setMatch(current), 300);
      }
    } else {
      setPassed((n) => n + 1);
    }
  }, [pets]);

  const visible = pets.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between max-w-sm mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-rose-400">
            <Image src={MY_PET.photo} alt="me" width={32} height={32} className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{MY_PET.name} {MY_PET.species}</p>
            <p className="text-xs text-gray-400">Demo Mode</p>
          </div>
        </div>
        <div className="flex gap-3 text-xs text-gray-400">
          <span className="text-emerald-500 font-semibold">{liked} ❤️</span>
          <span className="text-red-400 font-semibold">{passed} ✕</span>
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 flex flex-col items-center px-4 pt-4 pb-2 max-w-sm mx-auto w-full">
        <div className="relative w-full flex-1 max-h-[520px]">
          {pets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="text-6xl">🐾</span>
              <h3 className="text-xl font-bold text-gray-700">You&apos;ve seen everyone!</h3>
              <button
                onClick={() => { setPets(FAKE_PETS); setLiked(0); setPassed(0); }}
                className="px-6 py-2 bg-rose-500 text-white rounded-full font-semibold hover:bg-rose-600 transition-colors"
              >
                Start over
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {[...visible].reverse().map((pet, ri) => {
                const index = visible.length - 1 - ri;
                return (
                  <DemoCard
                    key={pet.id}
                    pet={pet}
                    isTop={index === 0}
                    index={index}
                    onSwipe={handleSwipe}
                  />
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Buttons */}
        {pets.length > 0 && (
          <div className="flex items-center justify-center gap-6 py-5">
            <button
              onClick={() => handleSwipe("PASS")}
              className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:border-red-400 hover:scale-110 active:scale-95 transition-all"
            >
              <X className="w-7 h-7 text-gray-400" />
            </button>
            <button
              onClick={() => handleSwipe("SUPERLIKE")}
              className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:border-blue-400 hover:scale-110 active:scale-95 transition-all"
            >
              <Star className="w-6 h-6 text-gray-400" />
            </button>
            <button
              onClick={() => handleSwipe("LIKE")}
              className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:border-rose-400 hover:scale-110 active:scale-95 transition-all"
            >
              <Heart className="w-7 h-7 text-gray-400" />
            </button>
          </div>
        )}

        {/* Demo hint */}
        <p className="text-xs text-gray-400 text-center pb-3">
          Demo mode — drag cards or use buttons · ← Pass · → Like · ↑ Superlike
          <br />
          <Link href="/" className="text-rose-400 hover:underline mt-1 inline-block">← Back to landing page</Link>
        </p>
      </div>

      {/* Match modal */}
      <AnimatePresence>
        {match && <MatchModal pet={match} onClose={() => setMatch(null)} />}
      </AnimatePresence>
    </div>
  );
}
