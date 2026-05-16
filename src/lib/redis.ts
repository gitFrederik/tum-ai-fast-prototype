import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

function getRedis(): Redis {
  if (redisClient) return redisClient;

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Return a mock client in dev if not configured
    return createMockRedis();
  }

  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  return redisClient;
}

function createMockRedis(): Redis {
  const store = new Map<string, unknown>();
  return {
    get: async (key: string) => store.get(key) ?? null,
    set: async (key: string, value: unknown) => { store.set(key, value); return "OK"; },
    incr: async (key: string) => {
      const cur = (store.get(key) as number) ?? 0;
      store.set(key, cur + 1);
      return cur + 1;
    },
    expire: async () => 1,
    exists: async (key: string) => (store.has(key) ? 1 : 0),
    del: async (key: string) => { store.delete(key); return 1; },
    setex: async (key: string, _ttl: number, value: unknown) => { store.set(key, value); return "OK"; },
  } as unknown as Redis;
}

export const redis = getRedis();

// Swipe deduplication helpers
export async function markSwiped(swiperPetId: string, swipedPetId: string): Promise<void> {
  const key = `swipe:${swiperPetId}:${swipedPetId}`;
  await redis.setex(key, 86400 * 30, "1");
}

export async function hasSwiped(swiperPetId: string, swipedPetId: string): Promise<boolean> {
  const key = `swipe:${swiperPetId}:${swipedPetId}`;
  const val = await redis.get(key);
  return val !== null;
}

// Daily swipe quota helpers
export async function getDailySwipeCount(userId: string): Promise<number> {
  const date = new Date().toISOString().slice(0, 10);
  const key = `swipes:${userId}:${date}`;
  const val = await redis.get<number>(key);
  return val ?? 0;
}

export async function incrementDailySwipe(userId: string): Promise<number> {
  const date = new Date().toISOString().slice(0, 10);
  const key = `swipes:${userId}:${date}`;
  const count = await redis.incr(key);
  await redis.expire(key, 86400);
  return count;
}

// Boost helpers
export async function setPetBoost(petId: string): Promise<void> {
  await redis.setex(`boost:${petId}`, 1800, "1");
}

export async function isPetBoosted(petId: string): Promise<boolean> {
  const val = await redis.get(`boost:${petId}`);
  return val !== null;
}
