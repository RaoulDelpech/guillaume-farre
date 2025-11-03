import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default function ConceptCarArtPage() {
  return (
    <main>
      <Navigation />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6">
            🏎️ Ferrari Live Performance
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Quand l'art et l'automobile fusionnent en temps réel
          </p>
        </div>
      </div>

      {/* Description principale */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Le Concept</h2>

          <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
            <p className="text-base md:text-lg leading-relaxed">
              La <strong className="text-foreground">Ferrari Live Performance</strong> est une expérience artistique unique où une Ferrari devient l'outil créateur.
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              Devant un public fasciné, je peins en direct en utilisant une Ferrari comme pinceau géant.
              Le véhicule, trempé dans la peinture, trace sur une toile monumentale des empreintes uniques,
              impossibles à reproduire.
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              Chaque performance crée une œuvre d'art originale, capturant l'essence du mouvement,
              la puissance du moteur V12, et l'énergie brute de l'automobile de prestige.
            </p>
          </div>
        </div>
      </section>

      {/* Le Processus */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Le Processus</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg bg-card/30">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-lg font-bold mb-2">1. Préparation</h3>
              <p className="text-sm text-muted-foreground">
                Installation d'une toile monumentale (jusqu'à 6 mètres) et préparation des peintures acryliques haute qualité.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card/30">
              <div className="text-3xl mb-3">🏎️</div>
              <h3 className="text-lg font-bold mb-2">2. La Ferrari</h3>
              <p className="text-sm text-muted-foreground">
                Une Ferrari (modèle historique ou moderne) est positionnée et ses roues sont enduites de peinture.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card/30">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-bold mb-2">3. Performance Live</h3>
              <p className="text-sm text-muted-foreground">
                Le moteur rugit, la Ferrari avance sur la toile, créant des traces uniques sous les yeux du public.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card/30">
              <div className="text-3xl mb-3">🖼️</div>
              <h3 className="text-lg font-bold mb-2">4. L'Œuvre Finale</h3>
              <p className="text-sm text-muted-foreground">
                Une pièce unique, signée et certifiée, témoignant de ce moment artistique exceptionnel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Origine du concept */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">L'Origine</h2>

          <div className="p-6 md:p-8 border rounded-lg bg-card/50">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
              « Enfant, je jouais avec ma petite Ferrari n°20, la trempant dans la peinture pour créer des traces sur le papier.
              Des années plus tard, j'ai réalisé ce rêve à échelle réelle. »
            </p>
            <p className="text-sm text-muted-foreground italic">
              — Guillaume Farré
            </p>
          </div>
        </div>
      </section>

      {/* Performances passées et futures */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Événements</h2>

          <div className="space-y-4">
            <div className="p-6 border rounded-lg bg-card/30">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold">Prochaine Performance</h3>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                  À venir
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Performance prévue lors d'un événement automobile prestigieux
              </p>
              <Link href="/contact" className="text-sm text-primary hover:underline">
                Contactez-moi pour plus d'informations →
              </Link>
            </div>

            <div className="p-6 border rounded-lg bg-card/30 opacity-75">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold">Performances Passées</h3>
                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                  Archive
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plusieurs performances réalisées lors d'événements privés et salons automobiles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commissioning */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Organiser une Performance</h2>

          <div className="p-6 md:p-8 border-2 border-primary rounded-lg bg-card/50">
            <p className="text-base md:text-lg mb-4">
              Vous souhaitez organiser une Ferrari Live Performance pour votre événement ?
            </p>

            <p className="text-sm text-muted-foreground mb-6">
              Idéal pour : salons automobiles, vernissages, événements corporate, lancements de produit,
              collections privées, célébrations exceptionnelles.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
              <div>
                <div className="font-bold mb-1">Durée</div>
                <div className="text-muted-foreground">2-4 heures (préparation + performance)</div>
              </div>
              <div>
                <div className="font-bold mb-1">Espace requis</div>
                <div className="text-muted-foreground">Minimum 10m × 8m</div>
              </div>
              <div>
                <div className="font-bold mb-1">Public</div>
                <div className="text-muted-foreground">20-500 personnes</div>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90 transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Galerie */}
      <section className="container mx-auto px-4 py-8 md:py-12 border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Découvrez les Œuvres</h2>
          <p className="text-muted-foreground mb-6">
            Explorez les créations issues des performances passées
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/galerie"
              className="px-6 py-3 border rounded-md font-bold hover:border-primary transition-colors"
            >
              Voir la galerie
            </Link>
            <Link
              href="/boutique"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90 transition-colors"
            >
              Acheter une œuvre
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
