import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";
import { z } from "zod";

const updatePetSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  species: z.enum(["DOG", "CAT", "RABBIT", "BIRD", "OTHER"]).optional(),
  breed: z.string().optional(),
  ageMonths: z.number().int().min(0).max(300).optional(),
  weightKg: z.number().optional(),
  bio: z.string().max(500).optional(),
  photos: z.array(z.string()).optional(),
  purpose: z.enum(["PLAYMATE", "BREEDING", "ADOPTION"]).optional(),
  neutered: z.boolean().optional(),
  vaccinated: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  active: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  const { petId } = await params;
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    include: { owner: { select: { id: true, name: true, image: true } } },
  });

  if (!pet) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...pet,
    photos: parseJsonArray(pet.photos as string),
    tags: parseJsonArray(pet.tags as string),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { petId } = await params;

  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet || pet.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = updatePetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { photos, tags, ...rest } = parsed.data;
  const updated = await prisma.pet.update({
    where: { id: petId },
    data: {
      ...rest,
      ...(photos !== undefined && { photos: JSON.stringify(photos) }),
      ...(tags !== undefined && { tags: JSON.stringify(tags) }),
    },
  });

  return NextResponse.json({
    ...updated,
    photos: parseJsonArray(updated.photos as string),
    tags: parseJsonArray(updated.tags as string),
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { petId } = await params;

  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet || pet.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.pet.delete({ where: { id: petId } });
  return NextResponse.json({ success: true });
}
