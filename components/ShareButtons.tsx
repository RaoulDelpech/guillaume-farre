"use client";
import { useState } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface ShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
}

/**
 * Boutons de partage - Direction artistique galerie haut de gamme
 * Style minimaliste et sobre
 *
 * @author Lalou
 * @updated 2025-01-20 - Conformité direction artistique
 */
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
        className="px-4 py-2 bg-muted/50 hover:bg-muted border border-border hover:border-foreground/30 font-light text-sm transition-all flex items-center gap-2"
      >
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

          {/* Menu - Style galerie minimaliste */}
          <div className="absolute top-full mt-2 right-0 bg-background border border-border p-4 z-50 shadow-lg min-w-[280px]">
            <div className="text-sm font-light mb-3 text-muted-foreground tracking-wide">
              Partager cette œuvre
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Facebook */}
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted border border-border hover:border-foreground/30 text-foreground text-sm font-light transition-all"
              >
                <span>Facebook</span>
              </button>

              {/* Twitter/X */}
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted border border-border hover:border-foreground/30 text-foreground text-sm font-light transition-all"
              >
                <span>Twitter</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare("linkedin")}
                className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted border border-border hover:border-foreground/30 text-foreground text-sm font-light transition-all"
              >
                <span>LinkedIn</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => handleShare("whatsapp")}
                className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted border border-border hover:border-foreground/30 text-foreground text-sm font-light transition-all"
              >
                <span>WhatsApp</span>
              </button>

              {/* Email */}
              <button
                onClick={() => handleShare("email")}
                className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted border border-border hover:border-foreground/30 text-foreground text-sm font-light transition-all"
              >
                <span>Email</span>
              </button>

              {/* Pinterest */}
              {shareLinks.pinterest && (
                <button
                  onClick={() => handleShare("pinterest")}
                  className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted border border-border hover:border-foreground/30 text-foreground text-sm font-light transition-all"
                >
                  <span>Pinterest</span>
                </button>
              )}
            </div>

            {/* Native share (mobile) */}
            {typeof navigator !== "undefined" && navigator.share !== undefined && (
              <button
                onClick={handleNativeShare}
                className="w-full mb-2 px-3 py-2 bg-foreground hover:bg-foreground/90 text-background text-sm font-light transition-all"
              >
                Partager via...
              </button>
            )}

            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              className="w-full px-3 py-2 bg-muted/50 hover:bg-muted border border-border hover:border-foreground/30 text-foreground text-sm font-light transition-all flex items-center justify-center gap-2"
            >
              {copied ? (
                <span>Lien copié</span>
              ) : (
                <span>Copier le lien</span>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Lalou
