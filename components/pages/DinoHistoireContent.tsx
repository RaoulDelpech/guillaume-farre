"use client";

import { HeroSection, AlfredoSection, MoteurSection } from './dino-histoire/EarlySections';
import { Dino206Section, Dino246Section, HeritageSection, MaDinoSection, CtaSection } from './dino-histoire/LaterSections';

/**
 * Contenu de la page Histoire de la Dino avec textes éditables
 *
 * @author Lalou
 * @date 2025-12-29
 */
export default function DinoHistoireContent() {
  return (
    <>
      <HeroSection />
      <AlfredoSection />
      <MoteurSection />
      <Dino206Section />
      <Dino246Section />
      <HeritageSection />
      <MaDinoSection />
      <CtaSection />
    </>
  );
}

// Lalou
