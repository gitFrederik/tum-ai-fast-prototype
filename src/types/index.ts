export type PetSpecies = "DOG" | "CAT" | "RABBIT" | "BIRD" | "OTHER";
export type PetPurpose = "PLAYMATE" | "BREEDING" | "ADOPTION";
export type SwipeDirection = "LIKE" | "PASS" | "SUPERLIKE";

export interface PetProfile {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed?: string | null;
  ageMonths: number;
  weightKg?: number | null;
  bio?: string | null;
  photos: string[];
  purpose: PetPurpose;
  neutered: boolean;
  vaccinated: boolean;
  tags: string[];
  latitude?: number | null;
  longitude?: number | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner?: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
  distanceKm?: number;
}

export interface MatchWithPets {
  id: string;
  petAId: string;
  petBId: string;
  matchedAt: Date;
  petA: PetProfile;
  petB: PetProfile;
  messages?: MessageData[];
  lastMessage?: MessageData;
  unreadCount?: number;
}

export interface MessageData {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  read: boolean;
}

export interface SwipeResult {
  matched: boolean;
  matchId?: string;
  matchData?: {
    petA: PetProfile;
    petB: PetProfile;
  };
}

export interface DiscoveryFilters {
  species?: PetSpecies;
  purpose?: PetPurpose;
  radiusKm?: number;
  minAge?: number;
  maxAge?: number;
  lat?: number;
  lng?: number;
}
