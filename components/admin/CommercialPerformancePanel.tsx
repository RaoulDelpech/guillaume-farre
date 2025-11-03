"use client";
import { useState } from 'react';
import { analyzeCommercialPerformance, type CommercialAnalysis } from '@/lib/commercial-performance';

interface CommercialPerformancePanelProps {
  photoTitle: string;
  category: string;
  currentPrice?: number;
}

export default function CommercialPerformancePanel({
  photoTitle,
  category,
  currentPrice,
}: CommercialPerformancePanelProps) {
  const [analysis, setAnalysis] = useState<CommercialAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    try {
      const result = analyzeCommercialPerformance(category, photoTitle, currentPrice);
      setAnalysis(result);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Erreur analyse:', error);
      alert('Erreur lors de l\'analyse');
    } finally {
      setLoading(false);
    }
  };

  if (!analysis || !showAnalysis) {
    return (
      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#ff6600',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        {loading ? '⏳ Analyse...' : '💼 Analyser Performance Commerciale'}
      </button>
    );
  }

  const { primary, alternatives } = analysis.recommendedStrategies;

  return (
    <div style={{ marginTop: '15px' }}>
      <button
        onClick={() => setShowAnalysis(!showAnalysis)}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#ff6600',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        {showAnalysis ? '💼 Masquer Performance' : '💼 Voir Performance Commerciale'}
      </button>

      {showAnalysis && (
        <div
          style={{
            backgroundColor: '#0a0a0a',
            border: '2px solid #ff6600',
            borderRadius: '8px',
            padding: '15px',
            marginTop: '10px',
            maxHeight: '600px',
            overflowY: 'auto',
          }}
        >
          {/* Stratégie Principale */}
          <div style={{ marginBottom: '20px', borderBottom: '2px solid #ff6600', paddingBottom: '15px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff6600', marginBottom: '10px' }}>
              🎯 STRATÉGIE RECOMMANDÉE
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>
              {primary.name}
            </div>
            <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '10px' }}>
              {primary.description}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '11px', color: '#888' }}>Édition</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f0' }}>
                  {primary.edition.type === 'unique' && `Pièce unique`}
                  {primary.edition.type === 'limited' && `${primary.edition.count} exemplaires`}
                  {primary.edition.type === 'open' && `Série ouverte`}
                </div>
              </div>

              <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '11px', color: '#888' }}>Prix</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f0' }}>
                  {primary.pricing.base.toLocaleString()}€ - {primary.pricing.max.toLocaleString()}€
                </div>
              </div>

              <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '11px', color: '#888' }}>Revenus/an</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {primary.projections.revenueRange}
                </div>
              </div>

              <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '11px', color: '#888' }}>Marge</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f0' }}>
                  {primary.projections.margin}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>Distribution:</div>
            <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '10px' }}>
              {primary.distribution.join(' • ')}
            </div>

            <div style={{ fontSize: '11px', marginTop: '10px' }}>
              <div style={{ color: '#0f0', marginBottom: '3px' }}>✅ Avantages:</div>
              {primary.pros.map((pro, idx) => (
                <div key={idx} style={{ fontSize: '11px', color: '#ccc', marginLeft: '10px' }}>
                  • {pro}
                </div>
              ))}
            </div>

            <div style={{ fontSize: '11px', marginTop: '8px' }}>
              <div style={{ color: '#f90', marginBottom: '3px' }}>⚠️ Points d'attention:</div>
              {primary.cons.map((con, idx) => (
                <div key={idx} style={{ fontSize: '11px', color: '#ccc', marginLeft: '10px' }}>
                  • {con}
                </div>
              ))}
            </div>
          </div>

          {/* Papiers Recommandés */}
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff6600', marginBottom: '10px' }}>
              📄 PAPIERS RECOMMANDÉS
            </div>

            {/* Papier optimal */}
            <div style={{ backgroundColor: '#1a3d1a', border: '2px solid #0f0', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f0', marginBottom: '5px' }}>
                ⭐ OPTIMAL: {analysis.paperRecommendations.optimal.name}
              </div>
              <div style={{ fontSize: '11px', color: '#ccc', marginBottom: '5px' }}>
                {analysis.paperRecommendations.optimal.composition} • {analysis.paperRecommendations.optimal.grammage}
              </div>
              <div style={{ fontSize: '11px', color: '#0a0', marginBottom: '5px' }}>
                {analysis.paperRecommendations.optimal.characteristics}
              </div>
              <div style={{ fontSize: '10px', color: '#888' }}>
                Conservation: {analysis.paperRecommendations.optimal.conservation} •
                Coût: ~{analysis.paperRecommendations.optimal.costPerM2}€/m²
              </div>
            </div>

            {/* Alternatives */}
            {analysis.paperRecommendations.alternatives.map((paper, idx) => (
              <div key={idx} style={{ backgroundColor: '#1a1a1a', border: '1px solid #555', padding: '8px', borderRadius: '5px', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '3px' }}>
                  Alternative #{idx + 1}: {paper.name}
                </div>
                <div style={{ fontSize: '10px', color: '#888' }}>
                  {paper.composition} • {paper.grammage} • ~{paper.costPerM2}€/m²
                </div>
                <div style={{ fontSize: '10px', color: '#ccc', marginTop: '3px' }}>
                  {paper.characteristics}
                </div>
              </div>
            ))}

            <div style={{ fontSize: '11px', color: '#888', marginTop: '10px', fontStyle: 'italic' }}>
              💡 {analysis.paperRecommendations.reasoning}
            </div>
          </div>

          {/* Matrice de pricing */}
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff6600', marginBottom: '10px' }}>
              💰 MATRICE DE PRICING
            </div>

            {analysis.pricingMatrix.map((item, idx) => (
              <div key={idx} style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                    {item.format}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f0' }}>
                    {item.price.toLocaleString()}€
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px' }}>
                  Papier: {item.paper} • {item.strategy}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                  <span style={{ color: '#0f0' }}>Marge: {item.margin.toLocaleString()}€</span>
                  <span style={{ color: '#888' }}>Breakeven: {item.breakeven}€</span>
                </div>
              </div>
            ))}
          </div>

          {/* Positionnement marché */}
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff6600', marginBottom: '10px' }}>
              📊 POSITIONNEMENT MARCHÉ
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>Unicité</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: analysis.marketPositioning.uniqueness === 'très élevée' ? '#0f0' : '#fa0' }}>
                  {analysis.marketPositioning.uniqueness.toUpperCase()}
                </div>
              </div>

              <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>Demande</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: analysis.marketPositioning.demandLevel === 'très forte' ? '#0f0' : '#fa0' }}>
                  {analysis.marketPositioning.demandLevel.toUpperCase()}
                </div>
              </div>

              <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>Concurrence</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: analysis.marketPositioning.competitionLevel === 'faible' ? '#0f0' : '#f90' }}>
                  {analysis.marketPositioning.competitionLevel.toUpperCase()}
                </div>
              </div>

              <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>Élasticité prix</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  {analysis.marketPositioning.priceElasticity.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Plan d'action */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff6600', marginBottom: '10px' }}>
              🚀 PLAN D'ACTION
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f0', marginBottom: '5px' }}>
                ⚡ Immédiat (cette semaine):
              </div>
              {analysis.actionPlan.immediate.map((action, idx) => (
                <div key={idx} style={{ fontSize: '11px', color: '#ccc', marginLeft: '10px', marginBottom: '3px' }}>
                  {action}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#fa0', marginBottom: '5px' }}>
                📅 Court terme (3 mois):
              </div>
              {analysis.actionPlan.shortTerm.map((action, idx) => (
                <div key={idx} style={{ fontSize: '11px', color: '#ccc', marginLeft: '10px', marginBottom: '3px' }}>
                  {action}
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#09f', marginBottom: '5px' }}>
                🎯 Long terme (1 an):
              </div>
              {analysis.actionPlan.longTerm.map((action, idx) => (
                <div key={idx} style={{ fontSize: '11px', color: '#ccc', marginLeft: '10px', marginBottom: '3px' }}>
                  {action}
                </div>
              ))}
            </div>
          </div>

          {/* Stratégies alternatives */}
          {alternatives.length > 0 && (
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff6600', marginBottom: '10px' }}>
                🔀 STRATÉGIES ALTERNATIVES
              </div>
              {alternatives.map((strategy, idx) => (
                <div key={idx} style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', padding: '10px', borderRadius: '5px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '3px' }}>
                    {strategy.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#888', marginBottom: '5px' }}>
                    {strategy.description}
                  </div>
                  <div style={{ fontSize: '10px', color: '#ccc' }}>
                    Prix: {strategy.pricing.base.toLocaleString()}€ - {strategy.pricing.max.toLocaleString()}€ •
                    Revenus: {strategy.projections.revenueRange}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Regenerate button */}
          <button
            onClick={handleAnalyze}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '15px',
              fontSize: '12px',
            }}
          >
            🔄 Régénérer l'analyse
          </button>
        </div>
      )}
    </div>
  );
}
