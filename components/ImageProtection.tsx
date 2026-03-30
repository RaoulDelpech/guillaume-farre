'use client';

import { useEffect } from 'react';

/**
 * Protection anti-copie des images.
 * Bloque clic droit, drag, et raccourcis courants de screenshot.
 * Note : pas infaillible (rien ne l'est cote client), mais dissuasif.
 *
 * @author Lalou
 */
export default function ImageProtection() {
  useEffect(() => {
    // Bloquer clic droit sur images
    function handleContextMenu(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('.protected-image-container')) {
        e.preventDefault();
      }
    }

    // Bloquer drag sur images
    function handleDragStart(e: DragEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
      }
    }

    // Bloquer raccourcis screenshot courants
    function handleKeyDown(e: KeyboardEvent) {
      // PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
      }
      // Cmd+Shift+3/4/5 (macOS screenshots)
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault();
      }
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
      }
    }

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
