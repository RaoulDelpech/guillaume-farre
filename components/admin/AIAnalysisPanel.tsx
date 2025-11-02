"use client";
import { useState } from 'react';
import { analyzePhotoCommercialPotential, type PhotoAnalysis } from '@/lib/ai-commercial-analyzer';

interface AIAnalysisPanelProps {
  photoFilename: string;
  category: string;
  currentPrice?: number;
  onApplySuggestions?: (suggestions: {
    price: number;
    formats: string[];
    isLimitedEdition: boolean;
    editionNumber?: number;
  }) => void;
}

export default function AIAnalysisPanel({
  photoFilename,
  category,
  currentPrice,
  onApplySuggestions
}: AIAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    // Simulation d'un délai pour l'effet "analyse en cours"
    setTimeout(() => {
      const result = analyzePhotoCommercialPotential(photoFilename, category, currentPrice);
      setAnalysis(result);
      setIsOpen(true);
      setIsAnalyzing(false);
    }, 800);
  };

  const applySuggestions = () => {
    if (!analysis || !onApplySuggestions) return;

    onApplySuggestions({
      price: analysis.priceRecommendation.basePrice,
      formats: analysis.formatRecommendations
        .filter(f => f.priority === 'high')
        .map(f => f.format),
      isLimitedEdition: analysis.editionStrategy.type === 'limited',
      editionNumber: analysis.editionStrategy.limitedNumber
    });

    setIsOpen(false);
  };

  const ScoreBar = ({ score, label, color }: { score: number; label: string; color: string }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );

  return (
    <div>
      {/* Bouton d'analyse */}
      <button
        onClick={runAnalysis}
        disabled={isAnalyzing}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Analyse en cours...
          </>
        ) : (
          <>
            <span className="text-xl">🤖</span>
            Analyser avec l'IA
          </>
        )}
      </button>

      {/* Panel d'analyse */}
      {isOpen && analysis && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">🎨 Analyse IA Commerciale</h2>
                  <p className="text-purple-100">{photoFilename}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Scores Globaux */}
              <section>
                <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Scores de Performance</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ScoreBar
                    score={analysis.commercialPotential}
                    label="💰 Potentiel Commercial"
                    color="#10b981"
                  />
                  <ScoreBar
                    score={analysis.artisticQuality}
                    label="🎨 Qualité Artistique"
                    color="#8b5cf6"
                  />
                  <ScoreBar
                    score={analysis.socialMediaViralityScore}
                    label="📱 Viralité Réseaux Sociaux"
                    color="#ef4444"
                  />
                  <ScoreBar
                    score={analysis.rarityScore}
                    label="💎 Score de Rareté"
                    color="#f59e0b"
                  />
                </div>
              </section>

              {/* Recommandation de Prix */}
              <section className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold mb-4 text-green-800 flex items-center gap-2">
                  💰 Recommandation de Prix
                </h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Minimum</p>
                    <p className="text-2xl font-bold text-gray-700">{analysis.priceRecommendation.minPrice}€</p>
                  </div>
                  <div className="text-center bg-green-100 rounded-lg p-2">
                    <p className="text-sm text-green-700 font-medium">RECOMMANDÉ</p>
                    <p className="text-3xl font-bold text-green-600">{analysis.priceRecommendation.basePrice}€</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Maximum</p>
                    <p className="text-2xl font-bold text-gray-700">{analysis.priceRecommendation.maxPrice}€</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700"><strong>Analyse :</strong> {analysis.priceRecommendation.reasoning}</p>
                  <p className="text-sm text-gray-600">{analysis.priceRecommendation.marketComparables}</p>
                </div>
              </section>

              {/* Formats Recommandés */}
              <section>
                <h3 className="text-xl font-bold mb-4 text-gray-800">📐 Formats Recommandés</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {analysis.formatRecommendations.map((format, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl p-4 border-2 ${
                        format.priority === 'high'
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg">{format.format}</span>
                        {format.priority === 'high' && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            PRIORITÉ
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{format.size}</p>
                      <p className="text-xl font-bold text-blue-600 mb-2">{format.suggestedPrice}€</p>
                      <p className="text-xs text-gray-700">{format.reasoning}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Stratégie d'Édition */}
              <section className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold mb-4 text-purple-800 flex items-center gap-2">
                  💎 Stratégie d'Édition
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {analysis.editionStrategy.type === 'limited' ? '🔒' : '∞'}
                    </span>
                    <div>
                      <p className="font-bold text-lg">
                        {analysis.editionStrategy.type === 'limited'
                          ? `Édition Limitée à ${analysis.editionStrategy.limitedNumber} exemplaires`
                          : 'Édition Ouverte'
                        }
                      </p>
                      <p className="text-sm text-gray-700">{analysis.editionStrategy.reasoning}</p>
                    </div>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-3">
                    <p className="text-sm font-medium text-purple-900">Impact sur la rareté :</p>
                    <p className="text-sm text-purple-800">{analysis.editionStrategy.scarcityImpact}</p>
                  </div>
                </div>
              </section>

              {/* Formats Exceptionnels */}
              {analysis.exceptionalFormats && analysis.exceptionalFormats.length > 0 && (
                <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300">
                  <h3 className="text-xl font-bold mb-4 text-amber-900 flex items-center gap-2">
                    ⭐ Formats Exceptionnels Suggérés
                  </h3>
                  <div className="space-y-4">
                    {analysis.exceptionalFormats.map((format, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-bold text-lg text-amber-900">{format.format}</span>
                            <p className="text-sm text-gray-600">{format.size}</p>
                          </div>
                          <span className="text-2xl font-bold text-amber-600">{format.price}€</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{format.reasoning}</p>
                        <p className="text-xs text-gray-600"><strong>Marché cible :</strong> {format.targetMarket}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Stratégie Réseaux Sociaux */}
              <section className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-6 border-2 border-pink-300">
                <h3 className="text-xl font-bold mb-4 text-pink-900 flex items-center gap-2">
                  📱 Stratégie Réseaux Sociaux
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Score Instagram</p>
                    <p className="text-3xl font-bold text-pink-600">{analysis.socialMediaStrategy.instagramScore}/100</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Type de Contenu</p>
                    <p className="text-xl font-bold text-gray-800">{analysis.socialMediaStrategy.contentType}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">⏰ Meilleur moment pour poster :</p>
                    <p className="text-sm text-gray-600">{analysis.socialMediaStrategy.bestTimeToPost}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">💬 Idée de caption :</p>
                    <p className="text-sm italic text-gray-700 bg-white rounded p-2">"{analysis.socialMediaStrategy.captionIdea}"</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">🏷️ Hashtags suggérés :</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.socialMediaStrategy.suggestedHashtags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Analyse Artistique */}
              <section>
                <h3 className="text-xl font-bold mb-4 text-gray-800">🎨 Analyse Artistique Détaillée</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(analysis.artisticAnalysis).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key === 'marketTrends' ? 'Tendances Marché' : key}
                      </p>
                      <p className="text-sm text-gray-600">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recommandations Stratégiques */}
              <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-indigo-300">
                <h3 className="text-xl font-bold mb-4 text-indigo-900 flex items-center gap-2">
                  🎯 Recommandations Stratégiques
                </h3>
                <ul className="space-y-2">
                  {analysis.strategicRecommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-indigo-600 font-bold flex-shrink-0">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t-2">
                <button
                  onClick={applySuggestions}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg"
                >
                  ✅ Appliquer les Suggestions
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
