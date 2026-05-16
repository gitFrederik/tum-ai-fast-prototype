import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.formData();
  const socketId = data.get("socket_id") as string;
  const channel = data.get("channel_name") as string;

  // Only allow users to subscribe to their own private channels
  if (channel === `private-user-${session.user.id}`) {
    const authData = pusherServer.authorizeChannel(socketId, channel);
    return NextResponse.json(authData);
  }

  // Allow match channels for participants
  if (channel.startsWith("private-match-")) {
    const matchId = channel.replace("private-match-", "");
    const { prisma } = await import("@/lib/prisma");
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        petA: { select: { ownerId: true } },
        petB: { select: { ownerId: true } },
      },
    });

    if (
      match &&
      (match.petA.ownerId === session.user.id || match.petB.ownerId === session.user.id)
    ) {
      const authData = pusherServer.authorizeChannel(socketId, channel);
      return NextResponse.json(authData);
    }
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
