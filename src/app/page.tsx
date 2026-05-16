import Link from "next/link";
import { PawPrint, MapPin, MessageCircle, Shield, Zap, Heart, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 px-6 text-center overflow-hidden">

        {/* background blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />

        {/* floating pet emojis */}
        <span className="absolute top-16 left-8 text-5xl opacity-30 rotate-[-15deg] select-none">🐕</span>
        <span className="absolute top-24 right-12 text-4xl opacity-30 rotate-[10deg] select-none">🐈</span>
        <span className="absolute bottom-32 left-12 text-3xl opacity-30 rotate-[8deg] select-none">🐰</span>
        <span className="absolute bottom-24 right-8 text-4xl opacity-30 rotate-[-5deg] select-none">🐦</span>
        <span className="absolute top-1/2 right-6 text-3xl opacity-20 select-none">🐾</span>

        {/* logo */}
        <div className="flex items-center gap-2 mb-6 z-10">
          <PawPrint className="w-7 h-7 text-white" />
          <span className="text-white font-black text-2xl tracking-tight">Pawnder</span>
        </div>

        {/* headline */}
        <h1 className="z-10 text-5xl md:text-7xl font-black text-white leading-[1.05] mb-4 max-w-2xl">
          Tinder,<br />but for<br />
          <span className="text-yellow-300">pets 🐾</span>
        </h1>

        <p className="z-10 text-white/80 text-lg md:text-xl max-w-md mb-10 leading-relaxed">
          Swipe right to find your pet&apos;s perfect playmate, breeding partner, or forever home. No sign-up needed to try it.
        </p>

        {/* CTA buttons */}
        <div className="z-10 flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/demo"
            className="flex items-center gap-2 bg-white text-rose-500 font-black text-xl px-10 py-5 rounded-2xl shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-transform"
          >
            <span>Try Demo</span>
            <span className="text-2xl">🐾</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white font-semibold text-lg px-8 py-4 rounded-2xl hover:bg-white/25 transition-colors"
          >
            Sign Up Free
          </Link>
        </div>

        <p className="z-10 text-white/50 text-sm mt-5">No account needed for the demo · 100% free</p>

        {/* mock phones */}
        <div className="z-10 flex items-end justify-center gap-4 mt-16 select-none pointer-events-none">
          <div className="w-36 h-64 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 overflow-hidden shadow-2xl rotate-[-6deg] translate-y-4">
            <div className="h-full bg-gradient-to-b from-amber-200/60 to-orange-300/60 flex flex-col items-center justify-end pb-5 px-3">
              <span className="text-4xl mb-1">🐕</span>
              <p className="text-white font-bold text-sm drop-shadow">Buddy, 2y</p>
              <p className="text-white/70 text-xs">Golden · 1.2km</p>
            </div>
          </div>

          <div className="w-44 h-80 rounded-3xl bg-white/25 backdrop-blur-sm border border-white/40 overflow-hidden shadow-2xl z-10">
            <div className="h-full bg-gradient-to-b from-rose-200/60 to-pink-300/60 flex flex-col items-center justify-end pb-5 px-3">
              <span className="text-5xl mb-1">🐈</span>
              <p className="text-white font-bold drop-shadow">Luna, 1y 6mo</p>
              <p className="text-white/70 text-xs mb-3">Persian · 0.8km</p>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center shadow-lg">
                  <span className="text-lg">✕</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-36 h-64 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 overflow-hidden shadow-2xl rotate-[6deg] translate-y-4">
            <div className="h-full bg-gradient-to-b from-emerald-200/60 to-teal-300/60 flex flex-col items-center justify-end pb-5 px-3">
              <span className="text-4xl mb-1">🐰</span>
              <p className="text-white font-bold text-sm drop-shadow">Coco, 8mo</p>
              <p className="text-white/70 text-xs">Mini Lop · 2.5km</p>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/40">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-400 mb-14 text-lg">Find your pet&apos;s soulmate in three taps</p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { emoji: "🐾", step: "1", title: "Create a profile", desc: "Add your pet's name, species, photos and personality tags in under a minute." },
              { emoji: "💝", step: "2", title: "Swipe & match", desc: "Swipe right to like, left to pass, up to superlike. When both pets like each other — it's a match!" },
              { emoji: "💬", step: "3", title: "Chat & meet", desc: "Message the owner and arrange a playdate. Our chat is real-time and instant." },
            ].map(({ emoji, step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-3xl shadow-sm">
                  {emoji}
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Step {step}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-14">
            Everything your pet deserves
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <MapPin className="w-5 h-5 text-rose-500" />, title: "Nearby matches", desc: "Find pets within your chosen radius. GPS-powered distance filter." },
              { icon: <Shield className="w-5 h-5 text-rose-500" />, title: "Verified profiles", desc: "See vaccination and neutering status. Responsible pet owners only." },
              { icon: <MessageCircle className="w-5 h-5 text-rose-500" />, title: "Real-time chat", desc: "Pusher-powered instant messaging. Suggest playdates in one tap." },
              { icon: <Zap className="w-5 h-5 text-rose-500" />, title: "Boost your pet", desc: "Premium: appear first in discovery for 30 minutes." },
              { icon: <Star className="w-5 h-5 text-rose-500" />, title: "See who likes you", desc: "Premium: see which pets already swiped right on yours." },
              { icon: <Heart className="w-5 h-5 text-rose-500" />, title: "All species welcome", desc: "Dogs, cats, rabbits, birds and more. Filter by species and purpose." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Simple pricing</h2>
          <p className="text-gray-400 mb-12 text-lg">Start free. Upgrade when your pet is ready to level up.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl border-2 border-gray-100 text-left">
              <h3 className="font-black text-2xl mb-1">Free</h3>
              <p className="text-gray-400 text-sm mb-5">For casual pet owners</p>
              <p className="text-5xl font-black mb-6">€0<span className="text-lg text-gray-400 font-normal">/mo</span></p>
              <ul className="space-y-2.5 text-sm text-gray-600 mb-8">
                {["20 swipes / day", "Unlimited matches", "Real-time chat", "Pet profiles"].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-3 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:border-rose-300 hover:text-rose-500 transition-colors">
                Get started free
              </Link>
            </div>
            <div className="p-8 rounded-3xl border-2 border-rose-400 text-left relative overflow-hidden">
              <div className="absolute top-5 right-5 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Popular</div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="font-black text-2xl">Premium</h3>
              </div>
              <p className="text-gray-400 text-sm mb-5">For serious matchmakers</p>
              <p className="text-5xl font-black mb-6">€9.99<span className="text-lg text-gray-400 font-normal">/mo</span></p>
              <ul className="space-y-2.5 text-sm text-gray-600 mb-8">
                {["Unlimited swipes", "See who liked you", "Profile boost (30 min)", "Priority in discovery", "Everything in Free"].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-rose-500 font-bold">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-semibold transition-colors">
                Upgrade now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        </div>
        <h2 className="relative text-4xl md:text-5xl font-black text-white mb-4">
          Your pet&apos;s best friend<br />is one swipe away 🐾
        </h2>
        <p className="relative text-white/70 text-lg mb-10">No sign-up required to try it out</p>
        <Link
          href="/demo"
          className="relative inline-flex items-center gap-3 bg-white text-rose-500 font-black text-xl px-12 py-5 rounded-2xl shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-transform"
        >
          Try the Demo <span className="text-2xl">🐾</span>
        </Link>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-gray-400 text-sm bg-white">
        <div className="flex items-center justify-center gap-2 mb-1">
          <PawPrint className="w-4 h-4 text-rose-400" />
          <span className="font-bold text-gray-600">Pawnder</span>
        </div>
        <p>Made with ❤️ for pet lovers · MIT License</p>
      </footer>

    </div>
  );
}
