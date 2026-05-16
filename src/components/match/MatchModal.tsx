"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { SwipeResult } from "@/types";

interface MatchModalProps {
  result: SwipeResult;
  onClose: () => void;
}

export function MatchModal({ result, onClose }: MatchModalProps) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Confetti
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#f43f5e", "#fb923c", "#facc15", "#4ade80", "#60a5fa"],
      });
    });

    timerRef.current = setTimeout(onClose, 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onClose]);

  const { matchData, matchId } = result;
  if (!matchData) return null;

  const { petA, petB } = matchData as {
    petA: { name: string; photos: string[] };
    petB: { name: string; photos: string[] };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div
        className="max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* It's a Match! */}
        <div className="mb-6">
          <p className="text-white/70 text-sm uppercase tracking-widest mb-1">It&apos;s a</p>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
            Match!
          </h1>
          <p className="text-white/60 mt-2 text-sm">
            {petA.name} and {petB.name} liked each other
          </p>
        </div>

        {/* Pet photos */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-rose-400 shadow-lg shadow-rose-500/30">
            {petA.photos[0] ? (
              <Image src={petA.photos[0]} alt={petA.name} width={112} height={112} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full bg-rose-100 flex items-center justify-center text-4xl">🐾</div>
            )}
          </div>

          <span className="text-3xl animate-pulse">❤️</span>

          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-pink-400 shadow-lg shadow-pink-500/30">
            {petB.photos[0] ? (
              <Image src={petB.photos[0]} alt={petB.name} width={112} height={112} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full bg-pink-100 flex items-center justify-center text-4xl">🐾</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              router.push(`/chat/${matchId}`);
              onClose();
            }}
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3"
          >
            Send a Message 💬
          </Button>
          <Button variant="outline" onClick={onClose} className="text-white border-white/30 hover:bg-white/10">
            Keep Swiping
          </Button>
        </div>
      </div>
    </div>
  );
}
