import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { markSwiped, getDailySwipeCount, incrementDailySwipe } from "@/lib/redis";
import { parseJsonArray } from "@/lib/utils";
import { pusherServer } from "@/lib/pusher";
import { z } from "zod";

const swipeSchema = z.object({
  swiperPetId: z.string(),
  swipedPetId: z.string(),
  direction: z.enum(["LIKE", "PASS", "SUPERLIKE"]),
});

const FREE_DAILY_LIMIT = 20;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = swipeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { swiperPetId, swipedPetId, direction } = parsed.data;

  // Validate caller owns swiperPet
  const swiperPet = await prisma.pet.findUnique({
    where: { id: swiperPetId },
    select: { ownerId: true },
  });
  if (!swiperPet || swiperPet.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Check premium subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });
  const isPremium = subscription?.status === "active";

  // Enforce daily swipe quota for free users
  if (!isPremium) {
    const count = await getDailySwipeCount(session.user.id);
    if (count >= FREE_DAILY_LIMIT) {
      return NextResponse.json(
        { error: "Daily swipe limit reached. Upgrade to Premium for unlimited swipes!" },
        { status: 429 }
      );
    }
  }

  // Upsert swipe record
  await prisma.swipe.upsert({
    where: { swiperPetId_swipedPetId: { swiperPetId, swipedPetId } },
    create: { swiperPetId, swipedPetId, direction },
    update: { direction },
  });

  // Mark in Redis cache
  await markSwiped(swiperPetId, swipedPetId);
  await incrementDailySwipe(session.user.id);

  // Check for mutual match (only on LIKE or SUPERLIKE)
  let matched = false;
  let matchId: string | undefined;
  let matchData: unknown;

  if (direction === "LIKE" || direction === "SUPERLIKE") {
    const reverseSwipe = await prisma.swipe.findUnique({
      where: { swiperPetId_swipedPetId: { swiperPetId: swipedPetId, swipedPetId: swiperPetId } },
    });

    if (reverseSwipe && (reverseSwipe.direction === "LIKE" || reverseSwipe.direction === "SUPERLIKE")) {
      // Create match (use consistent ordering to avoid duplicates)
      const [petAId, petBId] = [swiperPetId, swipedPetId].sort();

      const match = await prisma.match.upsert({
        where: { petAId_petBId: { petAId, petBId } },
        create: { petAId, petBId },
        update: {},
        include: {
          petA: { include: { owner: { select: { id: true, name: true, image: true } } } },
          petB: { include: { owner: { select: { id: true, name: true, image: true } } } },
        },
      });

      matched = true;
      matchId = match.id;
      matchData = {
        petA: { ...match.petA, photos: parseJsonArray(match.petA.photos as string), tags: parseJsonArray(match.petA.tags as string) },
        petB: { ...match.petB, photos: parseJsonArray(match.petB.photos as string), tags: parseJsonArray(match.petB.tags as string) },
      };

      // Trigger Pusher events for both owners
      try {
        await pusherServer.trigger(`private-user-${match.petA.ownerId}`, "match", {
          matchId: match.id,
          matchData,
        });
        await pusherServer.trigger(`private-user-${match.petB.ownerId}`, "match", {
          matchId: match.id,
          matchData,
        });
      } catch {
        // Pusher not configured — ignore
      }
    }
  }

  return NextResponse.json({ matched, matchId, matchData });
}
