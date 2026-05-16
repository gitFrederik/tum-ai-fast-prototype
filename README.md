# PawMatch 🐾

**Tinder for Pets** — Find your pet's perfect playmate, breeding partner, or adoption match.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gitFrederik/tum-ai-fast-prototype)

## Features

- **Swipe to match** — Drag cards left (pass), right (like), or up (superlike) with fluid Framer Motion animations
- **Smart discovery** — Filter by species, purpose, age, and radius; haversine-based distance sorting
- **Real-time chat** — Pusher-powered instant messaging with match notifications
- **Photo uploads** — Cloudinary signed uploads with auto-optimization (`f_auto,q_auto,w_800,h_800`)
- **Match celebration** — Confetti burst + match modal when two pets mutually like each other
- **Premium tier** — Stripe subscription; unlimited swipes, see who liked you, profile boost
- **Auth** — NextAuth.js with Google OAuth + magic-link email

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Auth | NextAuth.js v5 |
| Database | PostgreSQL (Prisma ORM) / SQLite for dev |
| Real-time | Pusher |
| Images | Cloudinary |
| Payments | Stripe |
| Cache | Upstash Redis |
| Deployment | Vercel |

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/gitFrederik/tum-ai-fast-prototype
cd tum-ai-fast-prototype
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in the values — see the table below. For local dev, SQLite works out of the box.

### 3. Set up the database

```bash
npx prisma generate
DATABASE_URL="file:./dev.db" npx prisma db push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL URL or `file:./dev.db` for SQLite | Yes |
| `NEXTAUTH_URL` | App base URL (`http://localhost:3000`) | Yes |
| `NEXTAUTH_SECRET` | Random secret (`openssl rand -base64 32`) | Yes |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | Yes |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | For uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | For uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | For uploads |
| `NEXT_PUBLIC_PUSHER_KEY` | Pusher app key | For real-time |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Pusher cluster (e.g. `eu`) | For real-time |
| `PUSHER_APP_ID` | Pusher app ID | For real-time |
| `PUSHER_SECRET` | Pusher secret | For real-time |
| `STRIPE_SECRET_KEY` | Stripe secret key | For payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | For payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | For payments |
| `STRIPE_PREMIUM_PRICE_ID` | Stripe price ID for premium plan | For payments |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | For rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | For rate limiting |

## Architecture

```
src/
├── app/                    # Next.js App Router pages + API routes
│   ├── (auth)/             # Login & onboarding (unauthenticated layout)
│   ├── discover/           # Main swipe screen
│   ├── matches/            # Matches list
│   ├── chat/[matchId]/     # Real-time chat
│   ├── profile/            # Pet profiles (view + edit)
│   ├── settings/           # Account & subscription
│   └── api/                # REST API routes
├── components/
│   ├── swipe/              # SwipeStack, PetCard, ActionButtons
│   ├── chat/               # ChatWindow, MessageBubble
│   ├── pet/                # PetProfileForm, PhotoUploader
│   ├── match/              # MatchModal with confetti
│   └── layout/             # Navbar, BottomNav
├── lib/                    # Prisma, auth, pusher, cloudinary, redis, stripe
└── types/                  # Shared TypeScript types
```

**Data flow:**
1. User swipes -> `POST /api/swipes` -> checks Redis quota -> saves to DB
2. If both pets liked each other -> creates `Match` -> Pusher events sent to both owners
3. Match modal with confetti appears -> user can start chatting
4. Messages via `POST /api/messages/[matchId]` -> saved to DB + Pusher broadcast

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m "feat: add my feature"`
4. Push and open a PR

## License

MIT
