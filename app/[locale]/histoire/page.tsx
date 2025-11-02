import Navigation from "@/components/navigation/Navigation";

export default function HistoirePage() {
  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">L&apos;Histoire</h1>
        <p className="text-muted-foreground">
          Découvrez le parcours artistique de Guillaume Farré.
        </p>
      </div>
    </main>
  );
}
