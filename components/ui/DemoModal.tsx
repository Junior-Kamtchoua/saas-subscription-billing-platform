"use client";

import { X } from "lucide-react";

type DemoModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function DemoModal({ open, onClose }: DemoModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal container */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-black p-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 rounded-full bg-white p-2 text-gray-900 shadow hover:bg-gray-100"
          aria-label="Close demo video"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Video */}
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <video className="h-full w-full" controls autoPlay muted playsInline>
            {/* 👉 TU METTRAS TA VIDÉO ICI PLUS TARD */}
            <source src="/demo/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
