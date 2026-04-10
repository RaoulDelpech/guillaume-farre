"use client";

export default function AIRecommendations() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        🤖 Recommandations basées sur l'analyse
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold text-purple-900 mb-2">🎯 Optimisation conversion</p>
          <p className="text-sm text-gray-700">
            Le taux d'abandon au checkout est élevé (62.5%).
            Considérez simplifier le processus et afficher les frais plus tôt.
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold text-blue-900 mb-2">📱 Mobile experience</p>
          <p className="text-sm text-gray-700">
            35% de trafic mobile mais conversion plus faible.
            Optimisez l'expérience mobile pour augmenter les ventes.
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold text-green-900 mb-2">📧 Newsletter performante</p>
          <p className="text-sm text-gray-700">
            Taux de conversion de 18.7% depuis newsletter.
            Augmentez la fréquence d'envoi et segmentez votre audience.
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold text-orange-900 mb-2">🖼️ Photos populaires</p>
          <p className="text-sm text-gray-700">
            Ferrari Noir #23 génère 30% plus de revenus.
            Créez plus de contenu similaire et mettez-le en avant.
          </p>
        </div>
      </div>
    </div>
  );
}

// Lalou
