"use client";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Lightbox from "@/components/lightbox/Lightbox";
import type { Work } from "@/lib/works";
import { altForWork, primaryImage } from "@/lib/images";

function editionLabel(w: Work) {
  if (w.edition.type === "limited") return `Édition limitée (${w.edition.count})`;
  return "Édition ouverte";
}

export default function GalleryGrid({ works }: { works: Work[] }) {
  const [open, setOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selected = works.find((w) => w.slug === selectedSlug) ?? null;

  return (
    <div className="mt-6 md:mt-8">
      <div className="masonry masonry-responsive">
        {works.map((w, index) => (
          <div key={w.slug} className="masonry-item">
            <button
              type="button"
              aria-label={`Agrandir ${w.title}`}
              className="group block w-full border-0 outline-none bg-transparent p-0 cursor-pointer"
              onClick={() => { setSelectedSlug(w.slug); setOpen(true); }}
            >
              {primaryImage(w) ? (
                <div className="relative w-full aspect-[4/5]">
                  <Image
                    src={primaryImage(w)!}
                    alt={altForWork(w)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k="
                  />
                </div>
              ) : (
                <div className="w-full h-48 rounded-md bg-muted" />
              )}
            </button>
            <div className="mt-2 md:mt-3">
              <Link href={`/galerie-item/${w.slug}`} className="text-sm md:text-base font-medium hover:underline block truncate">{w.title}</Link>
              <div className="text-xs md:text-sm text-muted-foreground">{w.year} — {w.type === 'photo' ? 'Photo' : 'Toile'}</div>
              <div className="text-xs text-muted-foreground truncate">{editionLabel(w)}</div>
            </div>
          </div>
        ))}
      </div>
      <Lightbox
        open={open}
        work={selected}
        works={works}
        onClose={() => setOpen(false)}
        onNavigate={(work) => setSelectedSlug(work.slug)}
      />
    </div>
  );
}
