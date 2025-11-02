import Navigation from "@/components/navigation/Navigation";

export default function PressePage() {
  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Presse</h1>
        <p className="text-muted-foreground">
          Articles et couverture médiatique.
        </p>
      </div>
    </main>
  );
}
