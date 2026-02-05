"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import GalleryGrid from "@/components/GalleryGrid";
import type { Work } from "@/lib/works";

type FilterType = 'all' | 'photo' | 'toile' | 'limited' | 'empreintes' | 'atelier' | 'projections';

interface GalleryClientProps {
  works: Work[];
}

const ITEMS_PER_PAGE = 24; // 24 photos par page (grille 4x6)

export default function GalleryClient({ works }: GalleryClientProps) {
  const searchParams = useSearchParams();
  const serieParam = searchParams.get('serie');

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Appliquer le filtre de série depuis l'URL
  useEffect(() => {
    if (serieParam && ['empreintes', 'atelier', 'projections'].includes(serieParam)) {
      setActiveFilter(serieParam as FilterType);
    }
  }, [serieParam]);

  // Filtrage des œuvres selon le filtre actif
  const filteredWorks = useMemo(() => {
    if (activeFilter === 'all') return works;
    if (activeFilter === 'photo') return works.filter(w => w.type === 'photo');
    if (activeFilter === 'toile') return works.filter(w => w.type === 'toile');
    if (activeFilter === 'limited') return works.filter(w => w.edition.type === 'limited');
    // Filtres par série
    if (activeFilter === 'empreintes') return works.filter(w => w.slug.startsWith('empreintes'));
    if (activeFilter === 'atelier') return works.filter(w => w.slug.startsWith('atelier'));
    if (activeFilter === 'projections') return works.filter(w => w.slug.startsWith('projection'));
    return works;
  }, [works, activeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredWorks.length / ITEMS_PER_PAGE);
  const paginatedWorks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWorks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWorks, currentPage]);

  // Reset page quand filtre change
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'empreintes', label: 'Empreintes' },
    { key: 'atelier', label: 'Atelier' },
    { key: 'projections', label: 'Projections' },
  ];

  return (
    <>
      {/* Section filtres élégante */}
      <section id="galerie-grid" className="bg-muted/10 border-b border-border py-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {filterButtons.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
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
      <section className="container mx-auto px-6 lg:px-8 py-16 md:py-20">
        {filteredWorks.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <p className="text-muted-foreground text-sm">
                {filteredWorks.length} œuvre{filteredWorks.length > 1 ? 's' : ''} {activeFilter !== 'all' && 'dans cette catégorie'}
                {totalPages > 1 && ` • Page ${currentPage}/${totalPages}`}
              </p>
            </div>
            <GalleryGrid works={paginatedWorks} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 border border-border hover:border-primary text-foreground hover:text-primary font-light tracking-wide rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-foreground"
                >
                  ← Précédent
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded transition-all ${
                          currentPage === pageNum
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'border border-border hover:border-primary text-foreground hover:text-primary'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 border border-border hover:border-primary text-foreground hover:text-primary font-light tracking-wide rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-foreground"
                >
                  Suivant →
                </button>
              </div>
            )}
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
