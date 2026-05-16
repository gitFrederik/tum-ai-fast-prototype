"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, PawPrint } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { MatchWithPets } from "@/types";

export default function MatchesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchWithPets[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/matches")
      .then((r) => r.json())
      .then((data) => { setMatches(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PawPrint className="w-10 h-10 animate-bounce text-rose-400" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Matches</h1>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-gray-400">
          <span className="text-6xl">💔</span>
          <p className="font-medium">No matches yet</p>
          <p className="text-sm">Keep swiping to find your pet&apos;s perfect match!</p>
          <Link href="/discover" className="text-rose-500 text-sm font-medium hover:underline">
            Start Swiping →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => {
            const petA = match.petA;
            const petB = match.petB;
            return (
              <Link key={match.id} href={`/chat/${match.id}`}>
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-sm transition-all">
                  {/* Overlapping avatars */}
                  <div className="relative w-16 h-12 shrink-0">
                    <div className="absolute left-0 top-0 w-11 h-11 rounded-full overflow-hidden border-2 border-white">
                      {petA.photos?.[0] ? (
                        <Image src={petA.photos[0]} alt={petA.name} width={44} height={44} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full bg-rose-100 flex items-center justify-center text-lg">🐾</div>
                      )}
                    </div>
                    <div className="absolute left-5 top-0 w-11 h-11 rounded-full overflow-hidden border-2 border-white">
                      {petB.photos?.[0] ? (
                        <Image src={petB.photos[0]} alt={petB.name} width={44} height={44} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full bg-pink-100 flex items-center justify-center text-lg">🐾</div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 truncate">
                        {petA.name} & {petB.name}
                      </p>
                      {(match.unreadCount ?? 0) > 0 && (
                        <Badge className="bg-rose-500 text-white text-xs h-5 min-w-5 flex items-center justify-center p-0 px-1.5">
                          {match.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {match.lastMessage
                        ? match.lastMessage.content
                        : `Matched ${formatDistanceToNow(new Date(match.matchedAt), { addSuffix: true })}`}
                    </p>
                  </div>

                  <MessageCircle className="w-5 h-5 text-gray-300 shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
