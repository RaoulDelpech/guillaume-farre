"use client";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Lightbox from "@/components/lightbox/Lightbox";
import type { Work } from "@/lib/works";
import { altForWork, primaryImage } from "@/lib/images";
import ScrollReveal from "@/components/animations/ScrollReveal";

function editionLabel(w: Work) {
  if (w.edition.type === "limited") return `Edition limitee (${w.edition.count})`;
  return "Edition ouverte";
}

function typeLabel(w: Work) {
  if (w.type === 'toile') return 'Toile';
  if (w.photoCategory === 'empreinte') return 'Empreinte';
  if (w.photoCategory === 'projection') return 'Projection';
  if (w.photoCategory === 'atelier') return 'Atelier';
  return w.type === 'photo' ? 'Photographie' : 'Toile';
}

function isPublishDateFuture(w: Work) {
  if (!w.publishDate) return false;
  return w.publishDate > new Date().toISOString().split('T')[0];
}

export default function GalleryGrid({ works, showPrices = false }: { works: Work[]; showPrices?: boolean }) {
  const [open, setOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selected = works.find((w) => w.slug === selectedSlug) ?? null;

  return (
    <div className="mt-6 md:mt-8">
      <div className="masonry masonry-responsive">
        {works.map((w, index) => (
          <ScrollReveal key={w.slug} delay={index * 0.06} className="masonry-item">
            <button
              type="button"
              aria-label={`Agrandir ${w.title}`}
              className="group block w-full border-0 outline-none bg-transparent p-0 cursor-pointer transition-all duration-700 ease-out"
              onClick={() => { setSelectedSlug(w.slug); setOpen(true); }}
            >
              {primaryImage(w) ? (
                <div className="protected-image-container relative w-full aspect-[4/5] overflow-hidden group-hover:shadow-2xl transition-shadow duration-300">
                  <Image
                    src={primaryImage(w)!}
                    alt={altForWork(w)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
                  />
                  {/* Overlay subtil au hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent group-hover:from-black/20 transition-all duration-700" />
                </div>
              ) : (
                <div className="w-full h-48 rounded-md bg-muted" />
              )}
            </button>
            <div className="mt-2 md:mt-3">
              <Link href={`/galerie-item/${w.slug}`} className="text-sm md:text-base font-medium hover:underline block truncate">{w.title}</Link>
              <div className="text-xs md:text-sm text-muted-foreground">{w.year} — {typeLabel(w)}</div>
              {w.collection && (
                <div className="text-xs text-muted-foreground/70 truncate">{w.collection}</div>
              )}
              {isPublishDateFuture(w) && (
                <div className="text-xs text-amber-400 mt-0.5">
                  Publication le {new Date(w.publishDate!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </div>
              )}
              <div className="text-xs text-muted-foreground truncate">{editionLabel(w)}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <Lightbox
        open={open}
        work={selected}
        works={works}
        onClose={() => setOpen(false)}
        onNavigate={(work) => setSelectedSlug(work.slug)}
        showPrices={showPrices}
      />
    </div>
  );
}
