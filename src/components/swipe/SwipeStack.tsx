"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { PetCard } from "./PetCard";
import { ActionButtons } from "./ActionButtons";
import type { PetProfile, SwipeDirection, SwipeResult } from "@/types";
import toast from "react-hot-toast";

interface SwipeStackProps {
  pets: PetProfile[];
  activePetId: string;
  onSwipe: (swipedPetId: string, direction: SwipeDirection) => Promise<SwipeResult>;
  onEmpty: () => void;
  onMatch: (result: SwipeResult) => void;
}

const SWIPE_THRESHOLD = 80;
const SUPERLIKE_THRESHOLD = -80;

function DraggableCard({
  pet,
  isTop,
  index,
  onSwipe,
}: {
  pet: PetProfile;
  isTop: boolean;
  index: number;
  onSwipe: (direction: SwipeDirection) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  const likeOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);
  const superlikeOpacity = useTransform(y, [SUPERLIKE_THRESHOLD, -20], [1, 0]);

  const handleDragEnd = useCallback(() => {
    const xVal = x.get();
    const yVal = y.get();

    if (yVal < SUPERLIKE_THRESHOLD) {
      onSwipe("SUPERLIKE");
    } else if (xVal > SWIPE_THRESHOLD) {
      onSwipe("LIKE");
    } else if (xVal < -SWIPE_THRESHOLD) {
      onSwipe("PASS");
    }
  }, [x, y, onSwipe]);

  const scale = 1 - index * 0.04;
  const yOffset = index * 8;

  if (!isTop) {
    return (
      <motion.div
        key={pet.id}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          scale,
          y: yOffset,
          zIndex: 10 - index,
        }}
        className="pointer-events-none"
      >
        <PetCard pet={pet} />
      </motion.div>
    );
  }

  return (
    <motion.div
      key={pet.id}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        x,
        y,
        rotate,
        zIndex: 20,
        cursor: "grab",
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
    >
      {/* Like overlay */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-8 z-30 border-4 border-emerald-400 rounded-xl px-4 py-2 rotate-[-12deg]"
      >
        <span className="text-emerald-400 text-3xl font-black tracking-wider">LIKE</span>
      </motion.div>

      {/* Pass overlay */}
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-8 right-8 z-30 border-4 border-red-400 rounded-xl px-4 py-2 rotate-[12deg]"
      >
        <span className="text-red-400 text-3xl font-black tracking-wider">NOPE</span>
      </motion.div>

      {/* Superlike overlay */}
      <motion.div
        style={{ opacity: superlikeOpacity }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 border-4 border-blue-400 rounded-xl px-4 py-2"
      >
        <span className="text-blue-400 text-3xl font-black tracking-wider">SUPER!</span>
      </motion.div>

      <PetCard pet={pet} />
    </motion.div>
  );
}

export function SwipeStack({ pets: initialPets, activePetId, onSwipe, onEmpty, onMatch }: SwipeStackProps) {
  const [pets, setPets] = useState<PetProfile[]>(initialPets);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPets(initialPets);
  }, [initialPets]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (loading || pets.length === 0) return;
      if (e.key === "ArrowLeft") handleSwipe("PASS");
      if (e.key === "ArrowRight") handleSwipe("LIKE");
      if (e.key === "ArrowUp") handleSwipe("SUPERLIKE");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const handleSwipe = useCallback(
    async (direction: SwipeDirection) => {
      if (loading || pets.length === 0) return;
      const [current, ...rest] = pets;
      setLoading(true);
      setPets(rest);

      try {
        const result = await onSwipe(current.id, direction);
        if (result.matched) {
          onMatch(result);
        }
      } catch {
        toast.error("Something went wrong. Try again!");
        setPets((prev) => [current, ...prev]);
      } finally {
        setLoading(false);
        if (rest.length === 0) onEmpty();
      }
    },
    [loading, pets, onSwipe, onMatch, onEmpty]
  );

  const visiblePets = pets.slice(0, 3);

  if (pets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
        <span className="text-6xl">🐾</span>
        <h3 className="text-xl font-bold text-gray-700">You've seen everyone nearby!</h3>
        <p className="text-gray-400 text-sm">Check back tomorrow for new matches</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 h-full">
      {/* Card stack */}
      <div className="relative w-full flex-1 max-w-sm mx-auto">
        <AnimatePresence>
          {[...visiblePets].reverse().map((pet, reversedIndex) => {
            const index = visiblePets.length - 1 - reversedIndex;
            const isTop = index === 0;
            return (
              <DraggableCard
                key={pet.id}
                pet={pet}
                isTop={isTop}
                index={index}
                onSwipe={handleSwipe}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="pb-2">
        <ActionButtons
          onPass={() => handleSwipe("PASS")}
          onSuperlike={() => handleSwipe("SUPERLIKE")}
          onLike={() => handleSwipe("LIKE")}
          disabled={loading || pets.length === 0}
        />
      </div>
    </div>
  );
}
