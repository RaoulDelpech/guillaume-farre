import { Link } from "@/i18n/routing";

export default function PanierSuccess() {
  return (
    <div className="text-center py-16 sm:py-28 max-w-4xl mx-auto px-4">
      <div className="text-5xl sm:text-6xl mb-6 sm:mb-8">✅</div>
      <h2 className="text-3xl sm:text-5xl font-light mb-4 sm:mb-6">Merci pour votre commande !</h2>
      <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
        Votre paiement a ete confirme avec succes.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 sm:p-8 mb-8 sm:mb-12 text-left max-w-2xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-light mb-4 sm:mb-6">Prochaines etapes</h3>
        <div className="space-y-4 text-muted-foreground">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <p className="font-medium text-foreground">Confirmation par email</p>
              <p className="text-sm">Vous allez recevoir un email de confirmation avec le récapitulatif de votre commande et votre facture.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <p className="font-medium text-foreground">Production de votre œuvre</p>
              <p className="text-sm">Impression Fine Art professionnelle (3-5 jours ouvrés)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="font-medium text-foreground">Expédition sécurisée</p>
              <p className="text-sm">Livraison assurée sous 2-4 jours (France métropolitaine)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✍️</span>
            <div>
              <p className="font-medium text-foreground">Certificat d'authenticité</p>
              <p className="text-sm">Signé par Guillaume Farré, inclus avec votre tirage</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="inline-block px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all"
        >
          Retour à l'accueil
        </Link>
        <Link
          href="/boutique"
          className="inline-block px-12 py-5 border-2 border-border hover:border-primary text-foreground font-light tracking-wide rounded-lg text-lg transition-all"
        >
          Continuer mes achats
        </Link>
      </div>

      <p className="text-sm text-muted-foreground mt-12">
        Une question ? Contactez-nous à <a href="mailto:contact@guillaumefarre.com" className="underline hover:text-primary">contact@guillaumefarre.com</a>
      </p>
    </div>
  );
}
