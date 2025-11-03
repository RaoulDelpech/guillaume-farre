"use client";
import SoundToggle from "./SoundToggle";
import ScrollProgress from "./ScrollProgress";
import BackToTop from "./BackToTop";
import { useEffect, useState } from "react";

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Sound Toggle */}
      <SoundToggle />

      {/* Back to Top Button */}
      <BackToTop />
    </>
  );
}
