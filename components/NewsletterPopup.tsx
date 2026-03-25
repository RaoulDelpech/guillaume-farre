"use client";
import { useState, useEffect } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useConfetti } from "@/hooks/useConfetti";

/**
 * Newsletter Popup - Direction artistique galerie haut de gamme
 * Style minimaliste et sobre
 *
 * @author Lalou
 * @updated 2025-01-20 - Conformité direction artistique
 */
export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { playSuccess, playClick } = useSoundEffects();
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    // Check if user already saw the popup
    const hasSeenPopup = localStorage.getItem("newsletter_popup_seen");
    const hasSubscribed = localStorage.getItem("newsletter_subscribed");

    if (!hasSeenPopup && !hasSubscribed) {
      // Show popup after 10 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        playClick();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    playClick();
    localStorage.setItem("newsletter_popup_seen", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsSubmitted(true);
    playSuccess();
    fireConfetti();
    localStorage.setItem("newsletter_subscribed", "true");

    // Close after 3 seconds
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal - Style galerie minimaliste */}
      <div className="relative bg-background border border-border p-6 md:p-8 max-w-lg w-full shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 bg-muted/50 hover:bg-muted border border-border flex items-center justify-center text-foreground transition-all"
        >
          ✕
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-3xl font-light tracking-wide mb-2">
                Newsletter
              </h3>
              <p className="text-muted-foreground font-light">
                Inscrivez-vous pour recevoir :
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-muted/30 border border-border p-4 mb-6">
              <ul className="space-y-2 text-sm font-light">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span>Nouvelles œuvres en exclusivité</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span>Invitations aux sessions live</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span>Offres spéciales collectionneurs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <span className="text-primary">-15%</span> sur votre
                    première commande
                  </span>
                </li>
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 bg-muted/30 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-foreground/50 transition-all font-light"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-4 bg-foreground hover:bg-foreground/90 text-background font-light tracking-wide transition-all"
              >
                Recevoir mon code -15%
              </button>
            </form>

            {/* Privacy note */}
            <p className="text-xs text-muted-foreground text-center mt-4 font-light">
              Vos données sont protégées. Vous pouvez vous désinscrire à tout
              moment.
            </p>
          </>
        ) : (
          <>
            {/* Success state */}
            <div className="text-center py-8">
              <h3 className="text-2xl md:text-3xl font-light tracking-wide mb-3">
                Merci pour votre inscription
              </h3>
              <p className="text-muted-foreground font-light mb-4">
                Consultez votre boîte mail pour recevoir votre code promo
                exclusif de -15%.
              </p>
              <div className="inline-block px-6 py-3 bg-muted border border-border text-foreground font-light tracking-widest">
                FERRARI15
              </div>
              <p className="text-xs text-muted-foreground mt-4 font-light">
                (Ce code est également dans votre email de bienvenue)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Lalou
