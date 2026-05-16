import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { z } from "zod";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { matchId } = await params;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      petA: { select: { ownerId: true } },
      petB: { select: { ownerId: true } },
    },
  });

  if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isParticipant =
    match.petA.ownerId === session.user.id ||
    match.petB.ownerId === session.user.id;

  if (!isParticipant) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { matchId },
    orderBy: { sentAt: "asc" },
  });

  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      matchId,
      senderId: { not: session.user.id },
      read: false,
    },
    data: { read: true },
  });

  return NextResponse.json(messages);
}

const sendSchema = z.object({
  content: z.string().min(1).max(1000),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { matchId } = await params;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      petA: { select: { ownerId: true } },
      petB: { select: { ownerId: true } },
    },
  });

  if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isParticipant =
    match.petA.ownerId === session.user.id ||
    match.petB.ownerId === session.user.id;

  if (!isParticipant) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      matchId,
      senderId: session.user.id,
      content: parsed.data.content,
    },
  });

  // Pusher real-time push
  try {
    await pusherServer.trigger(`private-match-${matchId}`, "message", message);
  } catch {
    // Pusher not configured — ignore
  }

  return NextResponse.json(message);
}
