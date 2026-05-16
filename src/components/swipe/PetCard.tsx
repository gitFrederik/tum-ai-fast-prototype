"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MapPin, Shield, Syringe, Star } from "lucide-react";
import { formatAge, formatDistance } from "@/lib/utils";
import type { PetProfile } from "@/types";
import { useState } from "react";

interface PetCardProps {
  pet: PetProfile;
  className?: string;
}

const speciesEmoji: Record<string, string> = {
  DOG: "🐕",
  CAT: "🐈",
  RABBIT: "🐰",
  BIRD: "🐦",
  OTHER: "🐾",
};

const purposeLabel: Record<string, string> = {
  PLAYMATE: "Playmate",
  BREEDING: "Breeding",
  ADOPTION: "Adoption",
};

const purposeColor: Record<string, string> = {
  PLAYMATE: "bg-emerald-100 text-emerald-700",
  BREEDING: "bg-purple-100 text-purple-700",
  ADOPTION: "bg-amber-100 text-amber-700",
};

export function PetCard({ pet, className }: PetCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const photos = pet.photos ?? [];
  const primaryPhoto = photos[imgIndex] ?? null;

  return (
    <div className={`relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-white select-none ${className}`}>
      {/* Photo */}
      <div className="absolute inset-0">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto}
            alt={pet.name}
            fill
            className="object-cover"
            draggable={false}
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
            <span className="text-8xl">{speciesEmoji[pet.species] ?? "🐾"}</span>
          </div>
        )}
      </div>

      {/* Photo dots */}
      {photos.length > 1 && (
        <div className="absolute top-3 left-0 right-0 flex gap-1 justify-center z-10">
          {photos.map((_, i) => (
            <button
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === imgIndex ? "w-6 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setImgIndex(i)}
            />
          ))}
        </div>
      )}

      {/* Left/Right photo tap zones */}
      {photos.length > 1 && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
            onClick={() => setImgIndex((i) => Math.max(0, i - 1))}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
            onClick={() => setImgIndex((i) => Math.min(photos.length - 1, i + 1))}
          />
        </>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-white text-3xl font-bold drop-shadow">
              {speciesEmoji[pet.species]} {pet.name}
            </h2>
            <p className="text-white/80 text-sm mt-0.5">
              {pet.breed ? `${pet.breed} · ` : ""}
              {formatAge(pet.ageMonths)}
              {pet.weightKg ? ` · ${pet.weightKg}kg` : ""}
            </p>
          </div>
          <Badge className={`${purposeColor[pet.purpose]} text-xs font-semibold shrink-0`}>
            {purposeLabel[pet.purpose]}
          </Badge>
        </div>

        {pet.bio && (
          <p className="text-white/80 text-sm line-clamp-2 mb-2">{pet.bio}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-2">
          {(pet.tags ?? []).slice(0, 4).map((tag) => (
            <Badge key={tag} className="bg-white/20 text-white text-xs backdrop-blur-sm border-0">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3 text-white/70 text-xs">
          {pet.distanceKm !== undefined && pet.distanceKm !== null && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {formatDistance(pet.distanceKm)}
            </span>
          )}
          {pet.vaccinated && (
            <span className="flex items-center gap-1 text-emerald-300">
              <Syringe className="w-3 h-3" /> Vaccinated
            </span>
          )}
          {pet.neutered && (
            <span className="flex items-center gap-1 text-blue-300">
              <Shield className="w-3 h-3" /> Neutered
            </span>
          )}
          {pet.purpose === "BREEDING" && (
            <span className="flex items-center gap-1 text-yellow-300">
              <Star className="w-3 h-3" /> Pedigree
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
