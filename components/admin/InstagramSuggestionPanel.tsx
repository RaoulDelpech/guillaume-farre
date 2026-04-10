"use client";

import { useState } from 'react';
import { generateOptimizedInstagramPost, type InstagramPost } from '@/lib/instagram-optimizer';
import InstagramModal from './instagram/InstagramModal';

interface InstagramSuggestionPanelProps {
  photoPath: string;
  photoTitle: string;
  category: string;
  seriesName?: string;
}

export default function InstagramSuggestionPanel({
  photoPath, photoTitle, category, seriesName,
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
    alert(`${label} copié !`);
  };

  const handlePostToInstagram = async () => {
    if (!suggestion) return;
    setPosting(true);

    try {
      const fullCaption = `${suggestion.caption.full}\n\n${suggestion.hashtags.full}`;
      const imageUrl = photoPath.startsWith('http') ? photoPath : `${window.location.origin}${photoPath}`;

      const statusResponse = await fetch('/api/instagram/post');
      const statusData = await statusResponse.json();

      if (!statusData.connected) {
        alert('Instagram non connecté\n\nVeuillez configurer votre compte Instagram dans les paramètres.\nLe post a été copié dans votre presse-papiers.');
        await navigator.clipboard.writeText(fullCaption);
        return;
      }

      const response = await fetch('/api/instagram/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, caption: fullCaption }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Post publié sur Instagram !\nPost ID: ${data.postId}`);
      } else {
        console.error('Erreur API Instagram:', data);
        alert(`Erreur lors de la publication:\n${data.error}\nLe post a été copié dans votre presse-papiers.`);
        await navigator.clipboard.writeText(fullCaption);
      }
    } catch (error) {
      console.error('Erreur post Instagram:', error);
      alert('Erreur lors de la publication Instagram\nLe post a été copié dans votre presse-papiers.');
      const fullPost = `${suggestion?.caption.full}\n\n${suggestion?.hashtags.full}`;
      await navigator.clipboard.writeText(fullPost);
    } finally {
      setPosting(false);
    }
  };

  return (
    <>
      <button onClick={handleGenerate} disabled={loading}
        className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
        title="Générer post Instagram">
        {loading ? '⏳' : '📷'}
      </button>

      {showModal && suggestion && (
        <InstagramModal
          suggestion={suggestion} photoPath={photoPath} posting={posting}
          onClose={() => setShowModal(false)} onRegenerate={handleGenerate}
          onPost={handlePostToInstagram} onCopy={copyToClipboard}
        />
      )}
    </>
  );
}

// Lalou
