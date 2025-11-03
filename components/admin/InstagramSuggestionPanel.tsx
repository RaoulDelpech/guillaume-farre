"use client";
import { useState } from 'react';
import { generateOptimizedInstagramPost, type InstagramPost } from '@/lib/instagram-optimizer';

interface InstagramSuggestionPanelProps {
  photoPath: string;
  photoTitle: string;
  category: string;
  seriesName?: string;
}

export default function InstagramSuggestionPanel({
  photoPath,
  photoTitle,
  category,
  seriesName,
}: InstagramSuggestionPanelProps) {
  const [suggestion, setSuggestion] = useState<InstagramPost | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    try {
      const post = generateOptimizedInstagramPost(photoPath, photoTitle, category, seriesName);
      setSuggestion(post);
      setShowSuggestion(true);
    } catch (error) {
      console.error('Erreur génération Instagram:', error);
      alert('Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`✅ ${label} copié !`);
  };

  if (!suggestion || !showSuggestion) {
    return (
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#e91e63',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        {loading ? '⏳ Génération...' : '📱 Générer post Instagram'}
      </button>
    );
  }

  return (
    <div style={{ marginTop: '15px' }}>
      <button
        onClick={() => setShowSuggestion(!showSuggestion)}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#e91e63',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        {showSuggestion ? '📱 Masquer Instagram' : '📱 Voir suggestions Instagram'}
      </button>

      {showSuggestion && (
        <div
          style={{
            backgroundColor: '#0a0a0a',
            border: '2px solid #e91e63',
            borderRadius: '8px',
            padding: '15px',
            marginTop: '10px',
          }}
        >
          {/* Visual Type */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>📸 Type de contenu</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e91e63' }}>
              {suggestion.visual.type === 'reel' && '🎬 REEL (Priorité MAX)'}
              {suggestion.visual.type === 'carousel' && '📸 CAROUSEL (Multi-photos)'}
              {suggestion.visual.type === 'post' && '🖼️ POST Simple'}
            </div>
            {suggestion.visual.duration && (
              <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                ⏱️ Durée: {suggestion.visual.duration}
              </div>
            )}
            {suggestion.visual.music && (
              <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                🎵 {suggestion.visual.music}
              </div>
            )}
          </div>

          {/* Caption */}
          <div style={{ marginBottom: '15px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#888' }}>✍️ Légende optimisée</div>
              <button
                onClick={() => copyToClipboard(suggestion.caption.full, 'Légende')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                📋 Copier
              </button>
            </div>
            <div
              style={{
                backgroundColor: '#1a1a1a',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '13px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {suggestion.caption.full}
            </div>
          </div>

          {/* Hashtags */}
          <div style={{ marginBottom: '15px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#888' }}>
                #️⃣ Hashtags ({suggestion.hashtags.primary.length + suggestion.hashtags.secondary.length + suggestion.hashtags.geo.length})
              </div>
              <button
                onClick={() => copyToClipboard(suggestion.hashtags.full, 'Hashtags')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                📋 Copier
              </button>
            </div>
            <div
              style={{
                backgroundColor: '#1a1a1a',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '11px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                maxHeight: '150px',
                overflowY: 'auto',
              }}
            >
              {suggestion.hashtags.full}
            </div>
          </div>

          {/* Timing */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>⏰ Meilleur timing</div>
            <div
              style={{
                backgroundColor: '#1a1a1a',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '13px',
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#0f0', marginBottom: '5px' }}>
                📅 {suggestion.timing.bestDay} à {suggestion.timing.bestTime}
              </div>
              <div style={{ fontSize: '11px', color: '#888' }}>{suggestion.timing.reasoning}</div>
            </div>
          </div>

          {/* Predictions */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>📊 Prédictions</div>
            <div
              style={{
                backgroundColor: '#1a1a1a',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
              }}
            >
              <div>📈 Reach estimé: <strong>{suggestion.predictions.estimatedReach}</strong></div>
              <div>💬 Engagement: <strong>{suggestion.predictions.estimatedEngagement}</strong></div>
              <div>🎯 Conversion: <strong style={{ color: suggestion.predictions.conversionPotential === 'élevé' ? '#0f0' : '#fa0' }}>{suggestion.predictions.conversionPotential}</strong></div>
            </div>
          </div>

          {/* Engagement Strategy */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>💬 Stratégie d'engagement</div>
            <div
              style={{
                backgroundColor: '#1a1a1a',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '11px',
                lineHeight: '1.5',
                maxHeight: '200px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {suggestion.engagementStrategy.replyToComments}
            </div>
          </div>

          {/* Technical Specs */}
          <div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>⚙️ Spécifications techniques</div>
            <div
              style={{
                backgroundColor: '#1a1a1a',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '11px',
              }}
            >
              <div>📐 Ratio: <strong>{suggestion.technicalSpecs.imageRatio}</strong></div>
              <div>🖼️ Résolution: <strong>{suggestion.technicalSpecs.resolution}</strong></div>
              <div>💾 Taille max: <strong>{suggestion.technicalSpecs.fileSize}</strong></div>
              <div>🎨 Filtres: <strong>{suggestion.technicalSpecs.filters}</strong></div>
            </div>
          </div>

          {/* Tips */}
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
            {suggestion.technicalSpecs.tips.map((tip, idx) => (
              <div key={idx} style={{ marginBottom: '3px' }}>{tip}</div>
            ))}
          </div>

          {/* Regenerate button */}
          <button
            onClick={handleGenerate}
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
            🔄 Régénérer les suggestions
          </button>
        </div>
      )}
    </div>
  );
}
