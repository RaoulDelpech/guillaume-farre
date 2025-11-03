"use client";
import { useState, useEffect } from "react";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useConfetti } from "@/hooks/useConfetti";

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

    // Simulate submission (in reality, send to email service)
    console.log("Newsletter signup:", email);

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

      {/* Modal */}
      <div className="relative bg-card border-2 border-primary/50 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-slideUp">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
        >
          ✕
        </button>

        {!isSubmitted ? (
          <>
            {/* Icon */}
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">📬</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Ne manquez rien !
              </h3>
              <p className="text-muted-foreground">
                Inscrivez-vous à la newsletter pour recevoir :
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-muted/40 border border-border rounded-xl p-4 mb-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Nouvelles œuvres en exclusivité</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Invitations aux performances live</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Offres spéciales collectionneurs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>
                    <strong className="text-primary">-15%</strong> sur votre
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
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-all"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg transition-all"
              >
                Recevoir mon code -15%
              </button>
            </form>

            {/* Privacy note */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              Vos données sont protégées. Vous pouvez vous désinscrire à tout
              moment.
            </p>
          </>
        ) : (
          <>
            {/* Success state */}
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Merci pour votre inscription !
              </h3>
              <p className="text-muted-foreground mb-4">
                Consultez votre boîte mail pour recevoir votre code promo
                exclusif de -15%.
              </p>
              <div className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg">
                FERRARI15
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                (Ce code est également dans votre email de bienvenue)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
