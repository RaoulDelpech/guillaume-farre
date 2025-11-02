import Navigation from "@/components/navigation/Navigation";

export default function AtelierPage() {
  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">L'Atelier</h1>
        <p className="text-muted-foreground">
          Au cœur de l'atelier, entre les voitures grises et les outils de création.
        </p>
      </div>
    </main>
  );
}
