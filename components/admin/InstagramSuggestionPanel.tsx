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
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    try {
      const post = generateOptimizedInstagramPost(photoPath, photoTitle, category, seriesName);
      setSuggestion(post);
      setShowModal(true);
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

  const handlePostToInstagram = async () => {
    setPosting(true);
    try {
      // TODO: Intégration API Instagram
      // Pour l'instant, on copie tout dans le clipboard et on ouvre Instagram
      const fullPost = `${suggestion?.caption.full}\n\n${suggestion?.hashtags.full}`;
      await navigator.clipboard.writeText(fullPost);

      alert('📱 Post copié ! Collez-le dans Instagram.\n\n💡 Astuce: Ouvrez Instagram sur votre téléphone et collez le contenu dans un nouveau post.');

      // Optionnel: Ouvrir Instagram web (si l'utilisateur est sur desktop)
      // window.open('https://www.instagram.com/create/select/', '_blank');
    } catch (error) {
      console.error('Erreur post Instagram:', error);
      alert('❌ Erreur lors de la préparation du post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <>
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

      {/* MODAL FULLSCREEN */}
      {showModal && suggestion && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            overflow: 'auto',
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              backgroundColor: '#0a0a0a',
              border: '3px solid #e91e63',
              borderRadius: '12px',
              padding: '30px',
              position: 'relative',
            }}
          >
            {/* HEADER avec bouton fermer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e91e63', paddingBottom: '15px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#e91e63', margin: 0 }}>
                📱 Post Instagram Optimisé
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            </div>

            {/* GRID 2 colonnes pour desktop */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
              {/* COLONNE GAUCHE */}
              <div>
                {/* Visual Type */}
                <div style={{ marginBottom: '25px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px', fontWeight: 'bold' }}>📸 Type de contenu</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#e91e63', marginBottom: '10px' }}>
                    {suggestion.visual.type === 'reel' && '🎬 REEL (Priorité MAX)'}
                    {suggestion.visual.type === 'carousel' && '📸 CAROUSEL (Multi-photos)'}
                    {suggestion.visual.type === 'post' && '🖼️ POST Simple'}
                  </div>
                  {suggestion.visual.duration && (
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
                      ⏱️ Durée: {suggestion.visual.duration}
                    </div>
                  )}
                  {suggestion.visual.music && (
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
                      🎵 {suggestion.visual.music}
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div style={{ marginBottom: '25px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ fontSize: '14px', color: '#888', fontWeight: 'bold' }}>✍️ Légende optimisée</div>
                    <button
                      onClick={() => copyToClipboard(suggestion.caption.full, 'Légende')}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                      }}
                    >
                      📋 Copier
                    </button>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#0a0a0a',
                      padding: '15px',
                      borderRadius: '6px',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      color: '#fff',
                    }}
                  >
                    {suggestion.caption.full}
                  </div>
                </div>

                {/* Timing */}
                <div style={{ marginBottom: '25px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px', fontWeight: 'bold' }}>⏰ Meilleur timing</div>
                  <div style={{ backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 'bold', color: '#0f0', marginBottom: '8px', fontSize: '16px' }}>
                      📅 {suggestion.timing.bestDay} à {suggestion.timing.bestTime}
                    </div>
                    <div style={{ fontSize: '13px', color: '#888' }}>{suggestion.timing.reasoning}</div>
                  </div>
                </div>
              </div>

              {/* COLONNE DROITE */}
              <div>
                {/* Hashtags */}
                <div style={{ marginBottom: '25px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ fontSize: '14px', color: '#888', fontWeight: 'bold' }}>
                      #️⃣ Hashtags ({suggestion.hashtags.primary.length + suggestion.hashtags.secondary.length + suggestion.hashtags.geo.length})
                    </div>
                    <button
                      onClick={() => copyToClipboard(suggestion.hashtags.full, 'Hashtags')}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                      }}
                    >
                      📋 Copier
                    </button>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#0a0a0a',
                      padding: '15px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '250px',
                      overflowY: 'auto',
                      color: '#09f',
                    }}
                  >
                    {suggestion.hashtags.full}
                  </div>
                </div>

                {/* Predictions */}
                <div style={{ marginBottom: '25px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px', fontWeight: 'bold' }}>📊 Prédictions</div>
                  <div style={{ backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '6px' }}>
                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                      📈 Reach estimé: <strong style={{ color: '#0f0' }}>{suggestion.predictions.estimatedReach}</strong>
                    </div>
                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                      💬 Engagement: <strong style={{ color: '#09f' }}>{suggestion.predictions.estimatedEngagement}</strong>
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      🎯 Conversion: <strong style={{ color: suggestion.predictions.conversionPotential === 'élevé' ? '#0f0' : '#fa0' }}>{suggestion.predictions.conversionPotential}</strong>
                    </div>
                  </div>
                </div>

                {/* Engagement Strategy */}
                <div style={{ marginBottom: '25px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px', fontWeight: 'bold' }}>💬 Stratégie d'engagement</div>
                  <div
                    style={{
                      backgroundColor: '#0a0a0a',
                      padding: '15px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      maxHeight: '250px',
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                      color: '#fff',
                    }}
                  >
                    {suggestion.engagementStrategy.replyToComments}
                  </div>
                </div>

                {/* Technical Specs */}
                <div style={{ marginBottom: '25px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px', fontWeight: 'bold' }}>⚙️ Spécifications techniques</div>
                  <div style={{ backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '6px', fontSize: '13px' }}>
                    <div style={{ marginBottom: '6px' }}>📐 Ratio: <strong>{suggestion.technicalSpecs.imageRatio}</strong></div>
                    <div style={{ marginBottom: '6px' }}>🖼️ Résolution: <strong>{suggestion.technicalSpecs.resolution}</strong></div>
                    <div style={{ marginBottom: '6px' }}>💾 Taille max: <strong>{suggestion.technicalSpecs.fileSize}</strong></div>
                    <div>🎨 Filtres: <strong>{suggestion.technicalSpecs.filters}</strong></div>
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                    {suggestion.technicalSpecs.tips.map((tip, idx) => (
                      <div key={idx} style={{ marginBottom: '5px' }}>{tip}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BOUTONS D'ACTION EN BAS - FULL WIDTH */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', paddingTop: '30px', borderTop: '2px solid #333' }}>
              <button
                onClick={handlePostToInstagram}
                disabled={posting}
                style={{
                  flex: 2,
                  padding: '18px 30px',
                  backgroundColor: '#e91e63',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: posting ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  opacity: posting ? 0.7 : 1,
                }}
              >
                {posting ? '⏳ Préparation...' : '📱 Publier sur Instagram'}
              </button>

              <button
                onClick={handleGenerate}
                style={{
                  flex: 1,
                  padding: '18px 30px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                🔄 Régénérer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
