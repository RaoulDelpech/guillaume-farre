"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Cookie helper functions
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export default function VideoIntro() {
  const [showVideo, setShowVideo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Ne pas afficher sur les pages admin ou login
    if (pathname?.includes("/admin") || pathname?.includes("/login")) return;

    // Check if user has already seen the intro
    const hasSeenIntro = getCookie("gf_intro_seen");

    // Show video if not seen before
    if (!hasSeenIntro) {
      setTimeout(() => setShowVideo(true), 300);
    }
  }, [pathname]);

  // Start video when it becomes visible and is ready - SON ACTIVÉ PAR DÉFAUT
  useEffect(() => {
    if (showVideo && videoRef.current) {
      const video = videoRef.current;

      const playVideo = () => {
        // Essayer de jouer AVEC le son d'abord
        video.muted = false;
        video.play().catch(() => {
          // Si autoplay avec son bloqué, essayer muted
          video.muted = true;
          video.play().catch(() => {
            // Silently fail if still blocked
          });
        });
      };

      // If video is already ready, play immediately
      if (video.readyState >= 3) {
        playVideo();
      } else {
        // Wait for video to be ready
        video.addEventListener("canplaythrough", playVideo, { once: true });
        // Also trigger load to ensure video starts loading
        video.load();
      }

      return () => {
        video.removeEventListener("canplaythrough", playVideo);
      };
    }
  }, [showVideo]);

  const handleSkip = () => {
    // Mark as seen and close
    setCookie("gf_intro_seen", "true", 30);
    setFadeOut(true);
    setTimeout(() => {
      setShowVideo(false);
    }, 500);
  };

  const handleVideoEnd = () => {
    // Mark as seen and fade out
    setCookie("gf_intro_seen", "true", 30);
    setFadeOut(true);
    setTimeout(() => {
      setShowVideo(false);
    }, 1000);
  };

  // Nothing to show
  if (!showVideo) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Video Player - adapté mobile */}
      {showVideo && (
        <div className="absolute inset-0 bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            style={{ objectPosition: 'center center' }}
            onEnded={handleVideoEnd}
            onCanPlay={() => {
              // Try to play when video is ready
              if (videoRef.current && videoRef.current.paused) {
                videoRef.current.play().catch(() => {
                  // Silently fail, useEffect will handle retry
                });
              }
            }}
            playsInline
            preload="auto"
            webkit-playsinline="true"
          >
            <source src="/video-intro.mp4" type="video/mp4" />
          </video>

          {/* Skip button - adapté mobile */}
          <button
            onClick={handleSkip}
            className="absolute bottom-4 right-4 md:bottom-8 md:right-8 text-white/60 hover:text-white text-xs md:text-sm font-light tracking-wide transition-colors flex items-center gap-1 md:gap-2 bg-black/30 px-3 py-2 md:px-4 md:py-2 rounded-sm backdrop-blur-sm"
          >
            Passer
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Mute/unmute button */}
          <MuteButton videoRef={videoRef} />
        </div>
      )}
    </div>
  );
}

// Bouton son avec CTA discret si muté
function MuteButton({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement> }) {
  const [isMuted, setIsMuted] = useState(true);
  const [showCta, setShowCta] = useState(true);

  // Vérifier l'état du son au montage
  useEffect(() => {
    if (videoRef.current) {
      setIsMuted(videoRef.current.muted);
      // Cacher le CTA après 5 secondes si pas cliqué
      const timer = setTimeout(() => setShowCta(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [videoRef]);

  const activateSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setShowCta(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      setShowCta(false);
    }
  };

  return (
    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 flex items-center gap-2 md:gap-3">
      {/* CTA incitatif si muté */}
      {isMuted && showCta && (
        <button
          onClick={activateSound}
          className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/30 transition-all text-xs md:text-sm tracking-wide animate-pulse shadow-lg"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <span className="hidden sm:inline">Cliquez pour le son</span>
          <span className="sm:hidden">Son</span>
        </button>
      )}

      {/* Bouton mute/unmute classique */}
      {!showCta && (
        <button
          onClick={toggleMute}
          className="text-white/60 hover:text-white transition-colors"
          aria-label={isMuted ? "Activer le son" : "Couper le son"}
        >
          {isMuted ? (
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
