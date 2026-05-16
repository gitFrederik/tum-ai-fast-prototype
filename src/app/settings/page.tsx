"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Zap, Crown, LogOut, Trash2, PawPrint } from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

interface Subscription {
  status: string;
  currentPeriodEnd: string;
}

function SettingsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (searchParams.get("success")) toast.success("Premium activated! 🎉");
    if (searchParams.get("canceled")) toast("Checkout canceled.");
  }, [searchParams]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/subscription")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setSubscription(data); setLoadingSub(false); })
      .catch(() => setLoadingSub(false));
  }, [status]);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      toast.error("Failed to start checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const isPremium = subscription?.status === "active";

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-black text-gray-900">Settings</h1>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Account</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-lg font-bold text-rose-500">
            {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{session?.user?.name ?? "Anonymous"}</p>
            <p className="text-sm text-gray-400">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Subscription</h2>
        {loadingSub ? (
          <div className="h-8 bg-gray-100 animate-pulse rounded" />
        ) : isPremium ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-500 fill-yellow-400" />
              <span className="font-semibold text-gray-900">Premium Active</span>
              <Badge className="bg-yellow-100 text-yellow-700 border-0">Active</Badge>
            </div>
            <p className="text-sm text-gray-400">
              Renews {subscription?.currentPeriodEnd
                ? formatDistanceToNow(new Date(subscription.currentPeriodEnd), { addSuffix: true })
                : "soon"}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-3">
              You&apos;re on the Free plan. Upgrade for unlimited swipes and see who liked your pet!
            </p>
            <Button
              onClick={handleUpgrade}
              disabled={checkoutLoading}
              className="bg-rose-500 hover:bg-rose-600 text-white gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              {checkoutLoading ? "Redirecting..." : "Upgrade to Premium — €9.99/mo"}
            </Button>
          </div>
        )}
      </div>

      {/* My Pets shortcut */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">My Pets</h2>
        <Button asChild variant="outline" className="gap-2">
          <a href="/profile">
            <PawPrint className="w-4 h-4" /> Manage Pet Profiles
          </a>
        </Button>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Account Actions</h2>
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full justify-start gap-2 text-gray-600"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full justify-start gap-2 text-red-500 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </Button>
        </div>
      </div>

      {/* Delete dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account, all pet profiles, matches, and messages. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await fetch("/api/account", { method: "DELETE" });
                signOut({ callbackUrl: "/" });
              }}
            >
              Delete Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}
