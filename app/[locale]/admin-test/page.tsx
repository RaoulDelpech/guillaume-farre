"use client";

export default function AdminTestPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-white text-4xl font-bold mb-4">TEST - Si vous voyez ceci sur fond NOIR, ça marche !</h1>
      <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
        Rouge - Test couleur
      </div>
      <div className="bg-green-600 text-white p-4 rounded-lg mb-4">
        Vert - Test couleur
      </div>
      <div className="bg-blue-600 text-white p-4 rounded-lg">
        Bleu - Test couleur
      </div>
      <p className="text-white mt-8">
        Si le fond est NOIR et que vous voyez les couleurs, le CSS fonctionne.
        Le problème est ailleurs (cache navigateur).
      </p>
    </div>
  );
}
