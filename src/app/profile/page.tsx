import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2 } from "lucide-react";
import { parseJsonArray, formatAge } from "@/lib/utils";

const speciesEmoji: Record<string, string> = {
  DOG: "🐕", CAT: "🐈", RABBIT: "🐰", BIRD: "🐦", OTHER: "🐾",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const pets = await prisma.pet.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">My Pets</h1>
        <Button asChild className="bg-rose-500 hover:bg-rose-600 text-white gap-1">
          <Link href="/onboard">
            <Plus className="w-4 h-4" /> Add Pet
          </Link>
        </Button>
      </div>

      {pets.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-gray-400">
          <span className="text-6xl">🐾</span>
          <p className="font-medium">No pets yet</p>
          <p className="text-sm">Add your first pet to start swiping!</p>
          <Button asChild className="bg-rose-500 hover:bg-rose-600 text-white mt-2">
            <Link href="/onboard">Add Pet Profile</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {pets.map((pet) => {
            const photos = parseJsonArray(pet.photos as string);
            const tags = parseJsonArray(pet.tags as string);
            return (
              <div key={pet.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-rose-50 shrink-0">
                    {photos[0] ? (
                      <Image src={photos[0]} alt={pet.name} width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {speciesEmoji[pet.species] ?? "🐾"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{pet.name}</h3>
                        <p className="text-sm text-gray-500">
                          {pet.breed ? `${pet.breed} · ` : ""}{formatAge(pet.ageMonths)}
                        </p>
                      </div>
                      <Link href={`/profile/${pet.id}/edit`}>
                        <Button variant="ghost" size="sm" className="shrink-0 text-gray-400 hover:text-rose-500">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} className="bg-rose-50 text-rose-600 border-0 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {pet.vaccinated && (
                        <Badge className="bg-emerald-50 text-emerald-600 border-0 text-xs">Vaccinated</Badge>
                      )}
                      {pet.neutered && (
                        <Badge className="bg-blue-50 text-blue-600 border-0 text-xs">Neutered</Badge>
                      )}
                      {!pet.active && (
                        <Badge className="bg-gray-100 text-gray-400 border-0 text-xs">Inactive</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-50 px-4 py-2 flex gap-2">
                  <Link href={`/profile/${pet.id}`} className="text-xs text-gray-400 hover:text-rose-500 transition-colors">
                    View Profile →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
