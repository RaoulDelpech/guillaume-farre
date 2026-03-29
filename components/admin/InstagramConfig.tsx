"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface InstagramStatus {
  connected: boolean;
  username?: string;
  profilePicture?: string;
  message?: string;
}

export default function InstagramConfig() {
  const [status, setStatus] = useState<InstagramStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [accountId, setAccountId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkInstagramConnection();
  }, []);

  const checkInstagramConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/instagram/post');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Erreur vérification Instagram:', error);
      setStatus({ connected: false, message: 'Erreur de connexion' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      // TODO: Implémenter la sauvegarde sécurisée des tokens
      // Pour l'instant, on guide l'utilisateur vers les variables d'environnement
      alert(
        '⚙️ Configuration Instagram\n\n' +
        'Pour connecter Instagram, ajoutez ces variables dans votre .env.local:\n\n' +
        'INSTAGRAM_ACCESS_TOKEN=' + accessToken + '\n' +
        'INSTAGRAM_ACCOUNT_ID=' + accountId + '\n\n' +
        'Puis redémarrez le serveur.'
      );
    } catch (error) {
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const getInstagramAuth = () => {
    // Informations pour obtenir les credentials Instagram
    alert(
      '📱 Configuration Instagram - Étapes:\n\n' +
      '1. Allez sur https://developers.facebook.com\n' +
      '2. Créez une App Facebook (type "Business")\n' +
      '3. Ajoutez le produit "Instagram Graph API"\n' +
      '4. Obtenez un Access Token avec les permissions:\n' +
      '   - instagram_basic\n' +
      '   - instagram_content_publish\n' +
      '   - pages_read_engagement\n' +
      '5. Récupérez votre Instagram Account ID\n' +
      '6. Collez ces informations ci-dessous\n\n' +
      '💡 Pour un token longue durée (60 jours):\n' +
      'https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens'
    );
    setShowConfig(true);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '2px solid #333' }}>
        <div style={{ color: '#888' }}>⏳ Vérification connexion Instagram...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '2px solid #333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
          📱 Connexion Instagram
        </h3>
        <button
          onClick={checkInstagramConnection}
          style={{
            padding: '8px 16px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          🔄 Actualiser
        </button>
      </div>

      {status?.connected ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', backgroundColor: '#0a3d0a', borderRadius: '8px', border: '2px solid #0f0' }}>
          {status.profilePicture && (
            <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #0f0', overflow: 'hidden', flexShrink: 0 }}>
              <Image
                src={status.profilePicture}
                alt={status.username || 'Instagram profile'}
                fill
                sizes="50px"
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f0', marginBottom: '5px' }}>
              ✅ Connecté
            </div>
            <div style={{ fontSize: '14px', color: '#0a0' }}>
              @{status.username}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ padding: '15px', backgroundColor: '#3d0a0a', borderRadius: '8px', border: '2px solid #f00', marginBottom: '15px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f00', marginBottom: '5px' }}>
              ❌ Non connecté
            </div>
            <div style={{ fontSize: '13px', color: '#a00' }}>
              {status?.message || 'Configuration Instagram requise'}
            </div>
          </div>

          {!showConfig ? (
            <button
              onClick={getInstagramAuth}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#e91e63',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              ⚙️ Configurer Instagram
            </button>
          ) : (
            <div style={{ marginTop: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc', fontSize: '13px' }}>
                  Access Token:
                </label>
                <input
                  type="text"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="IGQVJxxxxxxxxxxxxxx"
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#0a0a0a',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc', fontSize: '13px' }}>
                  Instagram Account ID:
                </label>
                <input
                  type="text"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="17841xxxxxxxxxx"
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#0a0a0a',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '5px',
                    fontSize: '13px',
                  }}
                />
              </div>

              <button
                onClick={handleSaveConfig}
                disabled={saving || !accessToken || !accountId}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#00aa00',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: saving || !accessToken || !accountId ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  opacity: saving || !accessToken || !accountId ? 0.5 : 1,
                }}
              >
                {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder la configuration'}
              </button>

              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#0a1a3d', borderRadius: '5px', border: '1px solid #09f' }}>
                <div style={{ fontSize: '11px', color: '#09f', marginBottom: '5px', fontWeight: 'bold' }}>
                  ℹ️ Comment obtenir ces informations:
                </div>
                <div style={{ fontSize: '11px', color: '#069', lineHeight: '1.6' }}>
                  1. Créez une app sur developers.facebook.com<br />
                  2. Activez Instagram Graph API<br />
                  3. Obtenez un token avec les permissions instagram_content_publish<br />
                  4. Récupérez votre Instagram Business Account ID
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
