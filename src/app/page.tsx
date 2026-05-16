import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PawPrint, MapPin, MessageCircle, Shield, Zap, Heart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-10 rotate-[-15deg]">🐕</div>
          <div className="absolute top-20 right-16 text-5xl opacity-10 rotate-[10deg]">🐈</div>
          <div className="absolute bottom-10 left-1/4 text-4xl opacity-10 rotate-[5deg]">🐰</div>
          <div className="absolute bottom-16 right-1/3 text-5xl opacity-10 rotate-[-8deg]">🐦</div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <PawPrint className="w-8 h-8 text-rose-500" />
            <span className="text-2xl font-black text-rose-500">PawMatch</span>
          </div>

          <Badge className="bg-rose-100 text-rose-600 border-0 mb-4 text-sm">
            🎉 Now in Beta — Free to join
          </Badge>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
            Find your pet&apos;s
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
              perfect match
            </span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Swipe. Match. Play. — The Tinder-style app for pet owners to find playmates,
            breeding partners, and adoption matches nearby.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-rose-500 hover:bg-rose-600 text-white text-lg px-8 h-14 rounded-2xl font-semibold shadow-lg shadow-rose-200"
            >
              <Link href="/login">Get Started Free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 h-14 rounded-2xl font-semibold border-2 border-rose-200 text-rose-500 hover:bg-rose-50"
            >
              <Link href="/demo">Try Demo 🐾</Link>
            </Button>
          </div>

          {/* Mock phone cards */}
          <div className="flex items-center justify-center gap-4 mt-16 select-none">
            <div className="w-44 h-72 rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 rotate-[-6deg] translate-y-4">
              <div className="h-full bg-gradient-to-br from-amber-100 to-orange-200 flex flex-col items-center justify-end pb-6">
                <span className="text-5xl mb-2">🐕</span>
                <p className="font-bold text-gray-800">Buddy, 2y</p>
                <p className="text-xs text-gray-500">Golden Retriever · 3km</p>
              </div>
            </div>
            <div className="w-48 h-80 rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 z-10">
              <div className="h-full bg-gradient-to-br from-rose-100 to-pink-200 flex flex-col items-center justify-end pb-6">
                <span className="text-5xl mb-2">🐈</span>
                <p className="font-bold text-gray-800">Luna, 1y 6mo</p>
                <p className="text-xs text-gray-500">Persian · 1.2km</p>
                <div className="flex gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow">
                    <span className="text-lg">✕</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center shadow">
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-44 h-72 rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 rotate-[6deg] translate-y-4">
              <div className="h-full bg-gradient-to-br from-emerald-100 to-teal-200 flex flex-col items-center justify-end pb-6">
                <span className="text-5xl mb-2">🐰</span>
                <p className="font-bold text-gray-800">Coco, 8mo</p>
                <p className="text-xs text-gray-500">Mini Lop · 2.5km</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center text-gray-900 mb-12">
          Everything your pet needs to find their BFF
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <MapPin className="w-6 h-6 text-rose-500" />,
              title: "Nearby Matches",
              desc: "Find pets within your chosen radius. Filter by species, purpose, and age.",
            },
            {
              icon: <Shield className="w-6 h-6 text-rose-500" />,
              title: "Safe & Verified",
              desc: "See vaccination and neutering status. Connect with responsible pet owners.",
            },
            {
              icon: <MessageCircle className="w-6 h-6 text-rose-500" />,
              title: "Real-time Chat",
              desc: "Match and instantly start chatting. Suggest playdates with one tap.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-gray-500 mb-12">Start free. Upgrade for unlimited matches.</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl border-2 border-gray-200 bg-white text-left">
              <h3 className="font-bold text-xl mb-1">Free</h3>
              <p className="text-gray-500 text-sm mb-6">Perfect for casual pet owners</p>
              <p className="text-4xl font-black mb-6">€0<span className="text-lg text-gray-400 font-normal">/mo</span></p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8">
                {["20 swipes per day", "Real-time chat", "Nearby pet discovery", "Match notifications"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>

            {/* Premium */}
            <div className="p-8 rounded-2xl border-2 border-rose-400 bg-white text-left relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-rose-500 text-white border-0 text-xs">Popular</Badge>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="font-bold text-xl">Premium</h3>
              </div>
              <p className="text-gray-500 text-sm mb-6">For serious pet matchmakers</p>
              <p className="text-4xl font-black mb-6">€9.99<span className="text-lg text-gray-400 font-normal">/mo</span></p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8">
                {[
                  "Unlimited swipes",
                  "See who liked your pet",
                  "Priority in discovery",
                  "Boost your pet profile",
                  "Everything in Free",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-rose-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                <Link href="/login">Upgrade Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-4">
          Your pet&apos;s new best friend is waiting 🐾
        </h2>
        <p className="text-gray-500 mb-8">Join thousands of pet owners already using PawMatch</p>
        <Button
          asChild
          size="lg"
          className="bg-rose-500 hover:bg-rose-600 text-white text-lg px-10 h-14 rounded-2xl font-semibold"
        >
          <Link href="/login">Find Matches Now</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <PawPrint className="w-4 h-4 text-rose-400" />
          <span className="font-semibold text-gray-600">PawMatch</span>
        </div>
        <p>Made with ❤️ for pet lovers everywhere · MIT License</p>
      </footer>
    </div>
  );
}
