"use client";
import { useState } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface ShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
}

export default function ShareButtons({
  title,
  description = "Découvrez cette œuvre unique de Guillaume Farré",
  url,
  imageUrl,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { playSuccess, playClick } = useSoundEffects();

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      playSuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
    pinterest: imageUrl
      ? `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(
          imageUrl
        )}&description=${encodedTitle}`
      : null,
  };

  const handleShare = (platform: string) => {
    playClick();
    const link = shareLinks[platform as keyof typeof shareLinks];
    if (link) {
      window.open(link, "_blank", "width=600,height=400");
    }
  };

  // Native Web Share API (mobile)
  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share !== undefined) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        playSuccess();
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowTooltip(!showTooltip);
          playClick();
        }}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
      >
        <span>🔗</span>
        <span>Partager</span>
      </button>

      {/* Share menu */}
      {showTooltip && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowTooltip(false)}
          />

          {/* Menu */}
          <div className="absolute top-full mt-2 right-0 bg-black border-2 border-white/20 rounded-xl p-4 z-50 shadow-2xl min-w-[280px]">
            <div className="text-sm font-bold mb-3 text-gray-400">
              Partager cette œuvre
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Facebook */}
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center gap-2 px-3 py-2 bg-[#1877F2] hover:bg-[#166FE5] rounded-lg text-white text-sm font-semibold transition-all"
              >
                <span>📘</span>
                <span>Facebook</span>
              </button>

              {/* Twitter/X */}
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-2 px-3 py-2 bg-[#1DA1F2] hover:bg-[#1A8CD8] rounded-lg text-white text-sm font-semibold transition-all"
              >
                <span>𝕏</span>
                <span>Twitter</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare("linkedin")}
                className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2] hover:bg-[#095196] rounded-lg text-white text-sm font-semibold transition-all"
              >
                <span>💼</span>
                <span>LinkedIn</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => handleShare("whatsapp")}
                className="flex items-center gap-2 px-3 py-2 bg-[#25D366] hover:bg-[#20BD5A] rounded-lg text-white text-sm font-semibold transition-all"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </button>

              {/* Email */}
              <button
                onClick={() => handleShare("email")}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold transition-all"
              >
                <span>📧</span>
                <span>Email</span>
              </button>

              {/* Pinterest */}
              {shareLinks.pinterest && (
                <button
                  onClick={() => handleShare("pinterest")}
                  className="flex items-center gap-2 px-3 py-2 bg-[#E60023] hover:bg-[#D0001F] rounded-lg text-white text-sm font-semibold transition-all"
                >
                  <span>📌</span>
                  <span>Pinterest</span>
                </button>
              )}
            </div>

            {/* Native share (mobile) */}
            {typeof navigator !== "undefined" && navigator.share !== undefined && (
              <button
                onClick={handleNativeShare}
                className="w-full mb-2 px-3 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-lg text-white text-sm font-semibold transition-all"
              >
                📱 Partager via...
              </button>
            )}

            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <span>✓</span>
                  <span>Lien copié !</span>
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span>Copier le lien</span>
                </>
              )}
            </button>

            {/* Stats */}
            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400 text-center">
              Partagez et aidez-nous à faire connaître l'art automobile ! 🏎️
            </div>
          </div>
        </>
      )}
    </div>
  );
}
