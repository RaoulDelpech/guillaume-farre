"use client";
import { useState, useEffect } from 'react';
import { analyzeCommercialPerformance } from '@/lib/commercial-performance';
import type { PhotoMetadata } from '@/lib/admin/photo-manager';

interface Opportunity {
  photo: PhotoMetadata;
  alertLevel: 'critical' | 'high' | 'medium';
  alertType: 'masterpiece' | 'limited_edition' | 'high_volume';
  estimatedValue: string;
  strategy: string;
  reasons: string[];
  actions: string[];
}

export default function CommercialDashboard({ photos }: { photos: PhotoMetadata[] }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    analyzeAllPhotos();
  }, [photos]);

  const analyzeAllPhotos = () => {
    setLoading(true);

    const detected: Opportunity[] = [];

    photos.forEach((photo) => {
      const analysis = analyzeCommercialPerformance(photo.category || 'autres', photo.filename, photo.price);

      // Critères de détection d'opportunités exceptionnelles
      const isMasterpiece =
        (photo.category === 'empreintes' || photo.category === 'atelier') &&
        analysis.marketPositioning.uniqueness === 'très élevée' &&
        analysis.recommendedStrategies.primary.pricing.max >= 50000;

      const isLimitedEdition =
        analysis.marketPositioning.demandLevel === 'très forte' &&
        analysis.recommendedStrategies.primary.pricing.base >= 8000;

      const isHighVolume =
        analysis.marketPositioning.competitionLevel === 'faible' &&
        analysis.recommendedStrategies.primary.projections.unitsPerYear >= 20;

      if (isMasterpiece) {
        detected.push({
          photo,
          alertLevel: 'critical',
          alertType: 'masterpiece',
          estimatedValue: `${analysis.recommendedStrategies.primary.pricing.base.toLocaleString()}€ - ${analysis.recommendedStrategies.primary.pricing.max.toLocaleString()}€`,
          strategy: analysis.recommendedStrategies.primary.name,
          reasons: [
            `Unicité: ${analysis.marketPositioning.uniqueness}`,
            `Demande: ${analysis.marketPositioning.demandLevel}`,
            `Concurrence: ${analysis.marketPositioning.competitionLevel}`,
            `Potentiel galerie internationale`,
          ],
          actions: analysis.actionPlan.immediate,
        });
      } else if (isLimitedEdition) {
        detected.push({
          photo,
          alertLevel: 'high',
          alertType: 'limited_edition',
          estimatedValue: `${analysis.recommendedStrategies.primary.pricing.base.toLocaleString()}€ - ${analysis.recommendedStrategies.primary.pricing.max.toLocaleString()}€`,
          strategy: analysis.recommendedStrategies.primary.name,
          reasons: [
            `Très forte demande`,
            `Prix premium justifiés`,
            `Faible concurrence`,
          ],
          actions: analysis.actionPlan.immediate,
        });
      } else if (isHighVolume) {
        detected.push({
          photo,
          alertLevel: 'medium',
          alertType: 'high_volume',
          estimatedValue: analysis.recommendedStrategies.primary.projections.revenueRange,
          strategy: analysis.recommendedStrategies.primary.name,
          reasons: [
            `Volume potentiel: ${analysis.recommendedStrategies.primary.projections.unitsPerYear}/an`,
            `Peu de concurrence`,
            `Revenus récurrents`,
          ],
          actions: analysis.actionPlan.immediate,
        });
      }
    });

    // Trier par niveau d'alerte
    detected.sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2 };
      return order[a.alertLevel] - order[b.alertLevel];
    });

    setOpportunities(detected);
    setLoading(false);
  };

  const filteredOpportunities = opportunities.filter(
    opp => filter === 'all' || opp.alertLevel === filter
  );

  const stats = {
    critical: opportunities.filter(o => o.alertLevel === 'critical').length,
    high: opportunities.filter(o => o.alertLevel === 'high').length,
    medium: opportunities.filter(o => o.alertLevel === 'medium').length,
    totalValue: opportunities.reduce((sum, opp) => {
      const match = opp.estimatedValue.match(/(\d+)\s*000€/);
      return sum + (match ? parseInt(match[1]) * 1000 : 0);
    }, 0),
  };

  return (
    <div className="bg-card border rounded-lg">
      {/* Header cliquable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isExpanded ? '▼' : '▶'}</span>
          <div className="text-left">
            <h2 className="text-xl font-bold">💼 Performance Commerciale</h2>
            <p className="text-xs text-muted-foreground">
              Détection automatique des œuvres à fort potentiel commercial
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {isExpanded ? 'Cliquez pour masquer' : 'Cliquez pour afficher'}
        </div>
      </button>

      {/* Contenu dépliable */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <div className="text-3xl font-bold text-destructive">{stats.critical}</div>
          <div className="text-xs text-muted-foreground mt-1">Chef-d'œuvre</div>
        </div>
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="text-3xl font-bold text-orange-500">{stats.high}</div>
          <div className="text-xs text-muted-foreground mt-1">Édition Premium</div>
        </div>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-3xl font-bold text-blue-500">{stats.medium}</div>
          <div className="text-xs text-muted-foreground mt-1">Volume</div>
        </div>
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="text-3xl font-bold text-green-500">{stats.totalValue.toLocaleString()}€</div>
          <div className="text-xs text-muted-foreground mt-1">Valeur totale</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Toutes ({opportunities.length})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === 'critical' ? 'bg-destructive text-destructive-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Critiques ({stats.critical})
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === 'high' ? 'bg-orange-500 text-white' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Élevées ({stats.high})
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === 'medium' ? 'bg-blue-500 text-white' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Moyennes ({stats.medium})
        </button>
      </div>

      {/* Liste des opportunités */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          ⏳ Analyse en cours...
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Aucune opportunité détectée
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {filteredOpportunities.map((opp, idx) => (
            <div
              key={idx}
              className={`border-l-4 rounded-r-lg p-4 ${
                opp.alertLevel === 'critical'
                  ? 'border-destructive bg-destructive/5'
                  : opp.alertLevel === 'high'
                  ? 'border-orange-500 bg-orange-500/5'
                  : 'border-blue-500 bg-blue-500/5'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={opp.photo.path}
                      alt={opp.photo.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold">{opp.photo.filename}</div>
                    <div className="text-xs text-muted-foreground">
                      {opp.photo.category} • {opp.strategy}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      opp.alertLevel === 'critical'
                        ? 'bg-destructive text-destructive-foreground'
                        : opp.alertLevel === 'high'
                        ? 'bg-orange-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {opp.alertLevel === 'critical' && '🔥 CHEF-D\'ŒUVRE'}
                    {opp.alertLevel === 'high' && '⭐ PREMIUM'}
                    {opp.alertLevel === 'medium' && '📈 VOLUME'}
                  </div>
                  <div className="text-lg font-bold mt-2">{opp.estimatedValue}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold mb-2 text-muted-foreground">📊 Analyse</div>
                  <ul className="space-y-1">
                    {opp.reasons.map((reason, i) => (
                      <li key={i} className="text-sm">• {reason}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold mb-2 text-muted-foreground">⚡ Actions Immédiates</div>
                  <ul className="space-y-1">
                    {opp.actions.slice(0, 3).map((action, i) => (
                      <li key={i} className="text-sm">{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouton rafraîchir */}
      <button
        onClick={analyzeAllPhotos}
        disabled={loading}
        className="w-full mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? '⏳ Analyse...' : '🔄 Réanalyser toutes les photos'}
      </button>

      {/* Légende */}
      <div className="mt-6 p-4 bg-muted rounded-md text-xs">
        <div className="font-bold mb-2">💡 Critères de détection :</div>
        <div className="space-y-1">
          <div><strong className="text-destructive">🔥 Chef-d'œuvre :</strong> Unicité très élevée + Potentiel 50K€+</div>
          <div><strong className="text-orange-500">⭐ Premium :</strong> Très forte demande + Prix 8K€+</div>
          <div><strong className="text-blue-500">📈 Volume :</strong> Faible concurrence + Volume 20+ unités/an</div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}
