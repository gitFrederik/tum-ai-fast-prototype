import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { haversineDistance, parseJsonArray } from "@/lib/utils";
import { hasSwiped, isPetBoosted } from "@/lib/redis";
import { z } from "zod";

const createPetSchema = z.object({
  name: z.string().min(1).max(50),
  species: z.enum(["DOG", "CAT", "RABBIT", "BIRD", "OTHER"]),
  breed: z.string().optional(),
  ageMonths: z.number().int().min(0).max(300),
  weightKg: z.number().optional(),
  bio: z.string().max(500).optional(),
  photos: z.array(z.string()).default([]),
  purpose: z.enum(["PLAYMATE", "BREEDING", "ADOPTION"]).default("PLAYMATE"),
  neutered: z.boolean().default(false),
  vaccinated: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
  const lng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;
  const species = searchParams.get("species") ?? undefined;
  const purpose = searchParams.get("purpose") ?? undefined;
  const radius = searchParams.get("radius") ? parseFloat(searchParams.get("radius")!) : 50;
  const page = parseInt(searchParams.get("page") ?? "1");

  // Get current user's pets
  const myPets = await prisma.pet.findMany({
    where: { ownerId: session.user.id, active: true },
    select: { id: true },
  });
  const myPetIds = myPets.map((p) => p.id);

  // Get already swiped pets from DB
  const swipedPets = await prisma.swipe.findMany({
    where: { swiperPetId: { in: myPetIds } },
    select: { swipedPetId: true },
  });
  const swipedPetIds = swipedPets.map((s) => s.swipedPetId);

  const where: Record<string, unknown> = {
    active: true,
    ownerId: { not: session.user.id },
    id: { notIn: [...myPetIds, ...swipedPetIds] },
  };

  if (species) where.species = species;
  if (purpose) where.purpose = purpose;

  const allPets = await prisma.pet.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, image: true } },
    },
    take: 50,
    skip: (page - 1) * 50,
  });

  // Filter by distance and check Redis cache
  let filteredPets = [];
  for (const pet of allPets) {
    // Check Redis cache for swipes
    for (const myPetId of myPetIds) {
      const swiped = await hasSwiped(myPetId, pet.id);
      if (swiped) continue;
    }

    // Distance filter
    if (lat && lng && pet.latitude && pet.longitude) {
      const dist = haversineDistance(lat, lng, pet.latitude, pet.longitude);
      if (dist > radius) continue;
      filteredPets.push({ ...pet, distanceKm: dist });
    } else {
      filteredPets.push({ ...pet, distanceKm: null });
    }
  }

  // Sort boosted pets first
  const boostedResults = [];
  const normalResults = [];
  for (const pet of filteredPets) {
    const boosted = await isPetBoosted(pet.id);
    if (boosted) boostedResults.push(pet);
    else normalResults.push(pet);
  }

  // Shuffle and limit
  const batch = [...boostedResults, ...shuffle(normalResults)].slice(0, 10);

  return NextResponse.json(
    batch.map((pet) => ({
      ...pet,
      photos: parseJsonArray(pet.photos as string),
      tags: parseJsonArray(pet.tags as string),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createPetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { photos, tags, ...rest } = parsed.data;

  const pet = await prisma.pet.create({
    data: {
      ...rest,
      ownerId: session.user.id,
      photos: JSON.stringify(photos),
      tags: JSON.stringify(tags),
    },
  });

  return NextResponse.json({
    ...pet,
    photos: parseJsonArray(pet.photos as string),
    tags: parseJsonArray(pet.tags as string),
  });
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
