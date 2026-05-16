"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PawPrint } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleGoogle = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/discover" });
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("nodemailer", { email, redirect: false, callbackUrl: "/discover" });
      if (res?.ok) setSent(true);
      else toast.error("Failed to send magic link");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-rose-500">
            <PawPrint className="w-7 h-7" /> Pawnder
          </Link>
          <p className="text-gray-500 mt-2 text-sm">Find your pet&apos;s perfect match</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <span className="text-5xl block mb-4">📬</span>
              <h2 className="font-bold text-xl mb-2">Check your inbox!</h2>
              <p className="text-gray-500 text-sm">
                We&apos;ve sent a magic link to <strong>{email}</strong>. Click it to sign in.
              </p>
            </div>
          ) : (
            <>
              {/* Google */}
              <Button
                onClick={handleGoogle}
                disabled={loading}
                variant="outline"
                className="w-full h-12 font-semibold border-2 mb-4 flex items-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">or</span>
                </div>
              </div>

              {/* Magic link */}
              <form onSubmit={handleMagicLink} className="space-y-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white font-semibold"
                >
                  Send Magic Link ✨
                </Button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                By signing in, you agree to our{" "}
                <span className="underline cursor-pointer">Terms</span> and{" "}
                <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
