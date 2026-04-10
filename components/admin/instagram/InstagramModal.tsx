"use client";

import type { InstagramPost } from '@/lib/instagram-optimizer';

interface InstagramModalProps {
  suggestion: InstagramPost;
  photoPath: string;
  posting: boolean;
  onClose: () => void;
  onRegenerate: () => void;
  onPost: () => void;
  onCopy: (text: string, label: string) => void;
}

export default function InstagramModal({
  suggestion, photoPath, posting,
  onClose, onRegenerate, onPost, onCopy
}: InstagramModalProps) {
  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 9999,
        overflow: 'auto', padding: '20px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        maxWidth: '1200px', margin: '0 auto', backgroundColor: '#0a0a0a',
        border: '3px solid #e91e63', borderRadius: '12px', padding: '30px', position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e91e63', paddingBottom: '15px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#e91e63', margin: 0 }}>
            📱 Post Instagram Optimisé
          </h2>
          <button onClick={onClose} style={{
            backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold',
          }}>✕</button>
        </div>

        {/* Grid 2 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          {/* Colonne gauche */}
          <div>
            <ModalCard title="📸 Type de contenu">
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#e91e63', marginBottom: '10px' }}>
                {suggestion.visual.type === 'reel' && '🎬 REEL (Priorité MAX)'}
                {suggestion.visual.type === 'carousel' && '📸 CAROUSEL (Multi-photos)'}
                {suggestion.visual.type === 'post' && '🖼️ POST Simple'}
              </div>
              {suggestion.visual.duration && (
                <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>⏱️ Durée: {suggestion.visual.duration}</div>
              )}
              {suggestion.visual.music && (
                <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>🎵 {suggestion.visual.music}</div>
              )}
            </ModalCard>

            <ModalCard title="✍️ Légende optimisée"
              action={{ label: '📋 Copier', onClick: () => onCopy(suggestion.caption.full, 'Légende') }}>
              <div style={{
                backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '6px', fontSize: '15px',
                lineHeight: '1.6', whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto', color: '#fff',
              }}>
                {suggestion.caption.full}
              </div>
            </ModalCard>

            <ModalCard title="⏰ Meilleur timing">
              <div style={{ backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '6px' }}>
                <div style={{ fontWeight: 'bold', color: '#0f0', marginBottom: '8px', fontSize: '16px' }}>
                  📅 {suggestion.timing.bestDay} à {suggestion.timing.bestTime}
                </div>
                <div style={{ fontSize: '13px', color: '#888' }}>{suggestion.timing.reasoning}</div>
              </div>
            </ModalCard>
          </div>

          {/* Colonne droite */}
          <div>
            <ModalCard title={`#️⃣ Hashtags (${suggestion.hashtags.primary.length + suggestion.hashtags.secondary.length + suggestion.hashtags.geo.length})`}
              action={{ label: '📋 Copier', onClick: () => onCopy(suggestion.hashtags.full, 'Hashtags') }}>
              <div style={{
                backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '6px', fontSize: '13px',
                lineHeight: '1.6', whiteSpace: 'pre-wrap', maxHeight: '250px', overflowY: 'auto', color: '#09f',
              }}>
                {suggestion.hashtags.full}
              </div>
            </ModalCard>

            <ModalCard title="📊 Prédictions">
              <div style={{ backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '6px' }}>
                <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                  📈 Reach estimé: <strong style={{ color: '#0f0' }}>{suggestion.predictions.estimatedReach}</strong>
                </div>
                <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                  💬 Engagement: <strong style={{ color: '#09f' }}>{suggestion.predictions.estimatedEngagement}</strong>
                </div>
                <div style={{ fontSize: '14px' }}>
                  🎯 Conversion: <strong style={{ color: suggestion.predictions.conversionPotential === 'élevé' ? '#0f0' : '#fa0' }}>
                    {suggestion.predictions.conversionPotential}
                  </strong>
                </div>
              </div>
            </ModalCard>

            <ModalCard title="💬 Stratégie d'engagement">
              <div style={{
                backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '6px', fontSize: '13px',
                lineHeight: '1.6', maxHeight: '250px', overflowY: 'auto', whiteSpace: 'pre-wrap', color: '#fff',
              }}>
                {suggestion.engagementStrategy.replyToComments}
              </div>
            </ModalCard>

            <ModalCard title="⚙️ Spécifications techniques">
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
            </ModalCard>
          </div>
        </div>

        {/* Boutons action */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px', paddingTop: '30px', borderTop: '2px solid #333' }}>
          <button onClick={onPost} disabled={posting} style={{
            flex: 2, padding: '18px 30px', backgroundColor: '#e91e63', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: posting ? 'not-allowed' : 'pointer',
            fontSize: '16px', fontWeight: 'bold', opacity: posting ? 0.7 : 1,
          }}>
            {posting ? '⏳ Préparation...' : '📱 Publier sur Instagram'}
          </button>
          <button onClick={onRegenerate} style={{
            flex: 1, padding: '18px 30px', backgroundColor: '#333', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
          }}>
            🔄 Régénérer
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalCard({ title, action, children }: {
  title: string;
  action?: { label: string; onClick: () => void };
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '25px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: action ? '15px' : '10px' }}>
        <div style={{ fontSize: '14px', color: '#888', fontWeight: 'bold' }}>{title}</div>
        {action && (
          <button onClick={action.onClick} style={{
            padding: '8px 16px', backgroundColor: '#333', color: '#fff',
            border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
          }}>
            {action.label}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// Lalou
