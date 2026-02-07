"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type DemoModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function DemoModal({ open, onClose }: DemoModalProps) {
  // Lock background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Modal container */}
      <div
        className="relative w-full max-w-5xl rounded-2xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute right-4 top-4 z-10
            rounded-full bg-black/60 p-2
            text-white
            transition hover:bg-black/80
          "
          aria-label="Close demo video"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Video wrapper */}
        <div className="relative w-full aspect-video rounded-2xl bg-black">
          <video
            className="h-full w-full rounded-2xl object-contain"
            controls
            autoPlay
            muted
            playsInline
          >
            <source src="/videos/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
