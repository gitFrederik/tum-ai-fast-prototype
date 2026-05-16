"use client";

import { PetProfileForm } from "@/components/pet/PetProfileForm";
import { PawPrint } from "lucide-react";

export default function OnboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-2xl font-black text-rose-500 mb-2">
            <PawPrint className="w-7 h-7" /> PawMatch
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Add your first pet</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create a profile so others can discover and match with your pet
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
          <PetProfileForm />
        </div>
      </div>
    </div>
  );
}
