"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PhotoUploader } from "./PhotoUploader";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import type { PetProfile, PetPurpose, PetSpecies } from "@/types";

interface PetProfileFormProps {
  initial?: Partial<PetProfile>;
  petId?: string;
  onSaved?: (pet: PetProfile) => void;
}

const SPECIES: PetSpecies[] = ["DOG", "CAT", "RABBIT", "BIRD", "OTHER"];
const PURPOSES: PetPurpose[] = ["PLAYMATE", "BREEDING", "ADOPTION"];
const SPECIES_LABELS: Record<PetSpecies, string> = {
  DOG: "🐕 Dog",
  CAT: "🐈 Cat",
  RABBIT: "🐰 Rabbit",
  BIRD: "🐦 Bird",
  OTHER: "🐾 Other",
};
const PURPOSE_LABELS: Record<PetPurpose, string> = {
  PLAYMATE: "Playmate",
  BREEDING: "Breeding",
  ADOPTION: "Adoption",
};

const SUGGESTED_TAGS = [
  "Loves fetch", "Good with kids", "Dog-friendly", "Cat-friendly",
  "Energetic", "Calm", "Trained", "Couch potato",
  "Adventure buddy", "Swimmer", "Loves cuddles",
];

export function PetProfileForm({ initial, petId, onSaved }: PetProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>(initial?.photos ?? []);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    species: (initial?.species ?? "DOG") as PetSpecies,
    breed: initial?.breed ?? "",
    ageMonths: initial?.ageMonths ?? 12,
    weightKg: initial?.weightKg ?? "",
    bio: initial?.bio ?? "",
    purpose: (initial?.purpose ?? "PLAYMATE") as PetPurpose,
    neutered: initial?.neutered ?? false,
    vaccinated: initial?.vaccinated ?? false,
  });

  const addTag = (tag: string) => {
    const clean = tag.trim();
    if (clean && !tags.includes(clean) && tags.length < 10) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      ageMonths: Number(form.ageMonths),
      weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      photos,
      tags,
    };

    try {
      const res = await fetch(petId ? `/api/pets/${petId}` : "/api/pets", {
        method: petId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      const pet = await res.json();

      toast.success(petId ? "Profile updated!" : "Pet added!");
      onSaved?.(pet);
      if (!petId) router.push("/discover");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photos */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Photos</Label>
        <PhotoUploader photos={photos} onChange={setPhotos} />
      </div>

      {/* Name */}
      <div>
        <Label htmlFor="name">Pet Name *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Buddy, Luna, Max..."
          required
          maxLength={50}
          className="mt-1"
        />
      </div>

      {/* Species */}
      <div>
        <Label className="mb-2 block">Species *</Label>
        <div className="flex flex-wrap gap-2">
          {SPECIES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setForm({ ...form, species: s })}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                form.species === s
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-rose-300"
              }`}
            >
              {SPECIES_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Breed & Age */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="breed">Breed</Label>
          <Input
            id="breed"
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
            placeholder="Labrador, Persian..."
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="age">Age (months) *</Label>
          <Input
            id="age"
            type="number"
            min={0}
            max={300}
            value={form.ageMonths}
            onChange={(e) => setForm({ ...form, ageMonths: Number(e.target.value) })}
            required
            className="mt-1"
          />
        </div>
      </div>

      {/* Weight */}
      <div>
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          min={0}
          value={form.weightKg}
          onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
          placeholder="5.5"
          className="mt-1"
        />
      </div>

      {/* Bio */}
      <div>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Tell us about your pet's personality..."
          maxLength={500}
          rows={3}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{form.bio.length}/500</p>
      </div>

      {/* Purpose */}
      <div>
        <Label className="mb-2 block">Looking for *</Label>
        <div className="flex gap-2">
          {PURPOSES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setForm({ ...form, purpose: p })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                form.purpose === p
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-rose-300"
              }`}
            >
              {PURPOSE_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label className="mb-2 block">Personality Tags</Label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} className="bg-rose-50 text-rose-700 border border-rose-200 gap-1">
              {tag}
              <button type="button" onClick={() => removeTag(tag)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); }
          }}
          placeholder="Type and press Enter..."
          className="mb-2"
        />
        <div className="flex flex-wrap gap-1">
          {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).slice(0, 6).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Neutered / Vaccinated */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.neutered}
            onChange={(e) => setForm({ ...form, neutered: e.target.checked })}
            className="w-4 h-4 accent-rose-500"
          />
          <span className="text-sm text-gray-700">Neutered / Spayed</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.vaccinated}
            onChange={(e) => setForm({ ...form, vaccinated: e.target.checked })}
            className="w-4 h-4 accent-rose-500"
          />
          <span className="text-sm text-gray-700">Vaccinated</span>
        </label>
      </div>

      <Button
        type="submit"
        disabled={loading || !form.name}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3"
      >
        {loading ? "Saving..." : petId ? "Save Changes" : "Create Pet Profile"}
      </Button>
    </form>
  );
}
