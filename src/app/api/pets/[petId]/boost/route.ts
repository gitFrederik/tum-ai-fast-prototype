import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setPetBoost } from "@/lib/redis";

export async function POST(
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

  // Premium check
  const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  if (sub?.status !== "active") {
    return NextResponse.json({ error: "Premium required for Boost" }, { status: 403 });
  }

  await setPetBoost(petId);
  return NextResponse.json({ success: true, boostedForSeconds: 1800 });
}
