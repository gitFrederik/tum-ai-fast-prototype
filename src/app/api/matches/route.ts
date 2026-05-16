import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const likedMe = searchParams.get("liked") === "true";

  // Get current user's pets
  const myPets = await prisma.pet.findMany({
    where: { ownerId: session.user.id },
    select: { id: true },
  });
  const myPetIds = myPets.map((p) => p.id);

  if (likedMe) {
    // Premium feature: see who liked your pets (without mutual match)
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });
    if (subscription?.status !== "active") {
      return NextResponse.json({ error: "Premium required" }, { status: 403 });
    }

    const likes = await prisma.swipe.findMany({
      where: {
        swipedPetId: { in: myPetIds },
        direction: { in: ["LIKE", "SUPERLIKE"] },
      },
      include: {
        swiperPet: {
          include: { owner: { select: { id: true, name: true, image: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      likes.map((l) => ({
        ...l.swiperPet,
        photos: parseJsonArray(l.swiperPet.photos as string),
        tags: parseJsonArray(l.swiperPet.tags as string),
        likedAt: l.createdAt,
      }))
    );
  }

  // Get all matches involving the user's pets
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { petAId: { in: myPetIds } },
        { petBId: { in: myPetIds } },
      ],
    },
    include: {
      petA: { include: { owner: { select: { id: true, name: true, image: true } } } },
      petB: { include: { owner: { select: { id: true, name: true, image: true } } } },
      messages: {
        orderBy: { sentAt: "desc" },
        take: 1,
      },
    },
    orderBy: { matchedAt: "desc" },
  });

  const result = await Promise.all(
    matches.map(async (m) => {
      const unreadCount = await prisma.message.count({
        where: {
          matchId: m.id,
          read: false,
          senderId: { not: session.user!.id },
        },
      });

      return {
        ...m,
        petA: {
          ...m.petA,
          photos: parseJsonArray(m.petA.photos as string),
          tags: parseJsonArray(m.petA.tags as string),
        },
        petB: {
          ...m.petB,
          photos: parseJsonArray(m.petB.photos as string),
          tags: parseJsonArray(m.petB.tags as string),
        },
        lastMessage: m.messages[0] ?? null,
        unreadCount,
      };
    })
  );

  return NextResponse.json(result);
}
