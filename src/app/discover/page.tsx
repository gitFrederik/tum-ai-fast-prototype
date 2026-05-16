"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SwipeStack } from "@/components/swipe/SwipeStack";
import { MatchModal } from "@/components/match/MatchModal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, ChevronDown, PawPrint } from "lucide-react";
import type { PetProfile, SwipeDirection, SwipeResult, DiscoveryFilters, PetSpecies, PetPurpose } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";

export default function DiscoverPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [myPets, setMyPets] = useState<PetProfile[]>([]);
  const [activePetId, setActivePetId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [matchResult, setMatchResult] = useState<SwipeResult | null>(null);
  const [filters, setFilters] = useState<DiscoveryFilters>({ radiusKm: 50 });
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  const fetchMyPets = useCallback(async () => {
    const res = await fetch("/api/pets?own=true");
    if (res.ok) {
      // We don't have own=true in the API — fetch profile route
      const petsRes = await fetch("/api/profile/pets");
      if (petsRes.ok) {
        const data = await petsRes.json();
        setMyPets(data);
        if (data.length > 0 && !activePetId) setActivePetId(data[0].id);
      }
    }
  }, [activePetId]);

  const fetchPets = useCallback(async () => {
    if (!activePetId) return;
    setLoading(true);
    setEmpty(false);
    const params = new URLSearchParams();
    if (filters.species) params.set("species", filters.species);
    if (filters.purpose) params.set("purpose", filters.purpose);
    if (filters.radiusKm) params.set("radius", filters.radiusKm.toString());

    // Try to get location
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
      );
      params.set("lat", pos.coords.latitude.toString());
      params.set("lng", pos.coords.longitude.toString());
    } catch {
      // Location unavailable — show pets without distance filter
    }

    const res = await fetch(`/api/pets?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setPets(data);
      if (data.length === 0) setEmpty(true);
    }
    setLoading(false);
  }, [activePetId, filters]);

  useEffect(() => {
    fetchMyPets();
  }, [fetchMyPets]);

  useEffect(() => {
    if (activePetId) fetchPets();
  }, [activePetId, fetchPets]);

  const handleSwipe = async (swipedPetId: string, direction: SwipeDirection): Promise<SwipeResult> => {
    if (!activePetId) return { matched: false };
    const res = await fetch("/api/swipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ swiperPetId: activePetId, swipedPetId, direction }),
    });
    if (!res.ok) {
      const err = await res.json();
      if (res.status === 429) toast.error(err.error);
      throw new Error(err.error ?? "Swipe failed");
    }
    return res.json();
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <PawPrint className="w-10 h-10 animate-bounce text-rose-400" />
          <p>Finding pets near you...</p>
        </div>
      </div>
    );
  }

  if (myPets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-6">
        <span className="text-6xl">🐾</span>
        <h2 className="text-xl font-bold text-gray-800">Add a pet first!</h2>
        <p className="text-gray-400 text-sm">You need at least one pet profile to start swiping</p>
        <Button asChild className="bg-rose-500 hover:bg-rose-600 text-white mt-2">
          <Link href="/onboard">Add Pet Profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gray-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 md:max-w-sm md:mx-auto w-full">
        {/* Active pet selector */}
        <Select value={activePetId} onValueChange={setActivePetId}>
          <SelectTrigger className="border-0 font-semibold text-gray-800 gap-1 p-0 h-auto shadow-none focus:ring-0 w-auto">
            <SelectValue />
            <ChevronDown className="w-4 h-4" />
          </SelectTrigger>
          <SelectContent>
            {myPets.map((pet) => (
              <SelectItem key={pet.id} value={pet.id}>
                {pet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filters */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader className="mb-6">
              <SheetTitle>Discovery Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 pb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Species</label>
                <div className="flex flex-wrap gap-2">
                  {(["DOG", "CAT", "RABBIT", "BIRD", "OTHER"] as PetSpecies[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilters((f) => ({ ...f, species: f.species === s ? undefined : s }))}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        filters.species === s
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Looking for</label>
                <div className="flex gap-2">
                  {(["PLAYMATE", "BREEDING", "ADOPTION"] as PetPurpose[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setFilters((f) => ({ ...f, purpose: f.purpose === p ? undefined : p }))}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        filters.purpose === p
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Distance: {filters.radiusKm ?? 50}km
                </label>
                <Slider
                  value={[filters.radiusKm ?? 50]}
                  onValueChange={([v]) => setFilters((f) => ({ ...f, radiusKm: v }))}
                  min={5}
                  max={200}
                  step={5}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={() => { fetchPets(); }}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Swipe stack */}
      <div className="flex-1 p-4 md:max-w-sm md:mx-auto w-full overflow-hidden">
        {empty ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <span className="text-6xl">🐾</span>
            <h3 className="text-xl font-bold text-gray-700">You&apos;ve seen everyone nearby!</h3>
            <p className="text-gray-400 text-sm">Check back tomorrow for new matches</p>
          </div>
        ) : (
          <SwipeStack
            pets={pets}
            activePetId={activePetId}
            onSwipe={handleSwipe}
            onEmpty={() => setEmpty(true)}
            onMatch={(result) => setMatchResult(result)}
          />
        )}
      </div>

      {/* Match modal */}
      {matchResult?.matched && (
        <MatchModal
          result={matchResult}
          onClose={() => setMatchResult(null)}
        />
      )}
    </div>
  );
}
