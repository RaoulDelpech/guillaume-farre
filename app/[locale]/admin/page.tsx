"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/photos')
      .then(res => res.json())
      .then(data => {
        console.log('Photos:', data);
        setPhotos(data);
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#FFFFFF',
      padding: '40px'
    }}>
      <h1 style={{ fontSize: '36px', color: '#FF0000', marginBottom: '20px' }}>
        🔴 ADMIN - VERSION SIMPLIFIÉE
      </h1>

      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Stats</h2>
        <p style={{ fontSize: '20px' }}>Total photos: {photos.length}</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {photos.slice(0, 20).map((photo, i) => (
          <div key={i} style={{
            backgroundColor: '#1a1a1a',
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #333'
          }}>
            <img
              src={photo.path}
              alt={photo.filename}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <p style={{ fontSize: '12px', marginTop: '8px' }}>{photo.filename}</p>
            <p style={{ fontSize: '11px', color: '#888' }}>{photo.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
