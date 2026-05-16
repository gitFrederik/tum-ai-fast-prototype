import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Shield, Syringe, Edit2 } from "lucide-react";
import { parseJsonArray, formatAge } from "@/lib/utils";

const speciesEmoji: Record<string, string> = {
  DOG: "🐕", CAT: "🐈", RABBIT: "🐰", BIRD: "🐦", OTHER: "🐾",
};
const purposeLabel: Record<string, string> = {
  PLAYMATE: "Playmate", BREEDING: "Breeding", ADOPTION: "Adoption",
};

export default async function PetProfilePage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  const session = await auth();

  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    include: { owner: { select: { id: true, name: true, image: true } } },
  });

  if (!pet) notFound();

  const photos = parseJsonArray(pet.photos as string);
  const tags = parseJsonArray(pet.tags as string);
  const isOwner = session?.user?.id === pet.ownerId;

  return (
    <div className="max-w-lg mx-auto pb-8">
      {/* Back button */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <button onClick={() => history.back()} className="text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-gray-900">{pet.name}</h2>
        {isOwner && (
          <Link href={`/profile/${petId}/edit`}>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-rose-500">
              <Edit2 className="w-4 h-4" />
            </Button>
          </Link>
        )}
        {!isOwner && <div className="w-9" />}
      </div>

      {/* Photo carousel */}
      {photos.length > 0 ? (
        <div className="relative h-80">
          <Image
            src={photos[0]}
            alt={pet.name}
            fill
            className="object-cover"
            priority
          />
          {photos.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex gap-1 justify-center">
              {photos.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full ${i === 0 ? "w-6 bg-white" : "w-3 bg-white/60"}`} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
          <span className="text-8xl">{speciesEmoji[pet.species] ?? "🐾"}</span>
        </div>
      )}

      {/* Info */}
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              {speciesEmoji[pet.species]} {pet.name}
            </h1>
            <p className="text-gray-500 mt-0.5">
              {pet.breed ? `${pet.breed} · ` : ""}{formatAge(pet.ageMonths)}
              {pet.weightKg ? ` · ${pet.weightKg}kg` : ""}
            </p>
          </div>
          <Badge
            className={`shrink-0 text-sm font-semibold ${
              pet.purpose === "PLAYMATE" ? "bg-emerald-100 text-emerald-700" :
              pet.purpose === "BREEDING" ? "bg-purple-100 text-purple-700" :
              "bg-amber-100 text-amber-700"
            }`}
          >
            {purposeLabel[pet.purpose]}
          </Badge>
        </div>

        {pet.bio && (
          <p className="text-gray-600 leading-relaxed">{pet.bio}</p>
        )}

        {/* Status badges */}
        <div className="flex flex-wrap gap-2">
          {pet.vaccinated && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm">
              <Syringe className="w-3.5 h-3.5" /> Vaccinated
            </div>
          )}
          {pet.neutered && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
              <Shield className="w-3.5 h-3.5" /> Neutered / Spayed
            </div>
          )}
          {pet.latitude && pet.longitude && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-sm">
              <MapPin className="w-3.5 h-3.5" /> Location set
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Personality</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} className="bg-rose-50 text-rose-600 border-rose-100 border text-sm font-medium">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Owner */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400">Owner: {pet.owner?.name ?? "Anonymous"}</p>
        </div>
      </div>
    </div>
  );
}
