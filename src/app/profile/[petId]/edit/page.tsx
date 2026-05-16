import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { PetProfileForm } from "@/components/pet/PetProfileForm";
import { parseJsonArray } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { PetSpecies, PetPurpose } from "@/types";

export default async function EditPetPage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) notFound();
  if (pet.ownerId !== session.user.id) redirect("/profile");

  const initial = {
    ...pet,
    species: pet.species as PetSpecies,
    purpose: pet.purpose as PetPurpose,
    photos: parseJsonArray(pet.photos as string),
    tags: parseJsonArray(pet.tags as string),
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/profile/${petId}`} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-black text-gray-900">Edit {pet.name}</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100">
        <PetProfileForm initial={initial} petId={petId} />
      </div>
    </div>
  );
}
