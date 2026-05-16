import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { parseJsonArray } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      petA: { include: { owner: { select: { id: true, name: true } } } },
      petB: { include: { owner: { select: { id: true, name: true } } } },
    },
  });

  if (!match) notFound();

  const isParticipant =
    match.petA.ownerId === session.user.id ||
    match.petB.ownerId === session.user.id;

  if (!isParticipant) redirect("/matches");

  // Determine the "other" pet
  const myPet = match.petA.ownerId === session.user.id ? match.petA : match.petB;
  const otherPet = match.petA.ownerId === session.user.id ? match.petB : match.petA;

  const otherPhotos = parseJsonArray(otherPet.photos as string);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <Link href="/matches" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <Link href={`/profile/${otherPet.id}`} className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-rose-100 shrink-0">
            {otherPhotos[0] ? (
              <Image src={otherPhotos[0]} alt={otherPet.name} width={40} height={40} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg">🐾</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{otherPet.name}</p>
            <p className="text-xs text-gray-400">
              {otherPet.breed} · Matched with {myPet.name}
            </p>
          </div>
        </Link>
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow matchId={matchId} petName={otherPet.name} />
      </div>
    </div>
  );
}
