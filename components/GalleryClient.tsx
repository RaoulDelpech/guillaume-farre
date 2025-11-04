"use client";

import { useState, useMemo } from "react";
import GalleryGrid from "@/components/GalleryGrid";
import type { Work } from "@/lib/works";

type FilterType = 'all' | 'photo' | 'toile' | 'limited';

interface GalleryClientProps {
  works: Work[];
}

export default function GalleryClient({ works }: GalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filtrage des œuvres selon le filtre actif
  const filteredWorks = useMemo(() => {
    if (activeFilter === 'all') return works;
    if (activeFilter === 'photo') return works.filter(w => w.type === 'photo');
    if (activeFilter === 'toile') return works.filter(w => w.type === 'toile');
    if (activeFilter === 'limited') return works.filter(w => w.edition.type === 'limited');
    return works;
  }, [works, activeFilter]);

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'photo', label: 'Photographies' },
    { key: 'toile', label: 'Toiles' },
    { key: 'limited', label: 'Éditions limitées' },
  ];

  return (
    <>
      {/* Section filtres élégante */}
      <section className="bg-muted/20 border-b border-border py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {filterButtons.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-8 py-3 border font-light tracking-wide rounded transition-all ${
                  activeFilter === key
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-border text-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="container mx-auto px-6 lg:px-8 py-28 md:py-36">
        {filteredWorks.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <p className="text-muted-foreground text-sm">
                {filteredWorks.length} œuvre{filteredWorks.length > 1 ? 's' : ''} {activeFilter !== 'all' && 'dans cette catégorie'}
              </p>
            </div>
            <GalleryGrid works={filteredWorks} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground font-light">
              Aucune œuvre dans cette catégorie pour le moment
            </p>
          </div>
        )}
      </section>
    </>
  );
}
