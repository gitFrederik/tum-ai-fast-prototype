"use client";

import { X, Star, Heart } from "lucide-react";

interface ActionButtonsProps {
  onPass: () => void;
  onSuperlike: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export function ActionButtons({ onPass, onSuperlike, onLike, disabled }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={onPass}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:border-red-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all disabled:opacity-40"
        aria-label="Pass"
      >
        <X className="w-7 h-7 text-gray-400" />
      </button>

      <button
        onClick={onSuperlike}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:border-blue-400 hover:text-blue-500 hover:scale-110 active:scale-95 transition-all disabled:opacity-40"
        aria-label="Superlike"
      >
        <Star className="w-6 h-6 text-gray-400" />
      </button>

      <button
        onClick={onLike}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:border-rose-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all disabled:opacity-40"
        aria-label="Like"
      >
        <Heart className="w-7 h-7 text-gray-400" />
      </button>
    </div>
  );
}
