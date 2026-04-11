"use client";
import { Link } from "@/i18n/routing";
import AmericanFrame from "@/components/AmericanFrame";

const doors = [
  {
    href: "/toiles" as const,
    label: "Toiles",
    subtitle: "Peintures sur toile",
    previewImage: "/images/toiles/9.jpg",
    previewWidth: 1281,
    previewHeight: 1281,
    frameColor: "black" as const,
  },
  {
    href: "/galerie" as const,
    label: "Photographies",
    subtitle: "",
    previewImage: "/images/works/photos/1.jpg",
    previewWidth: 2000,
    previewHeight: 1333,
    frameColor: "walnut" as const,
  },
];

export default function AtelierDoors() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 max-w-5xl mx-auto">
          {doors.map((door, index) => (
            <Link
              key={door.href}
              href={door.href}
              className="group relative block atelier-door-link"
              style={{ perspective: "1200px" }}
            >
              {/* Porte d'atelier — panneau principal avec ouverture 3D */}
              <div
                className="relative transition-transform duration-700 ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: index === 0 ? "left center" : "right center",
                }}
              >
                {/* Fond bois — grain subtil */}
                <div className="atelier-door-panel relative overflow-hidden rounded-[2px]">
                  {/* Texture bois via gradient */}
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(
                          ${index === 0 ? "87deg" : "93deg"},
                          transparent,
                          transparent 3px,
                          rgba(139, 90, 43, 0.3) 3px,
                          rgba(139, 90, 43, 0.3) 4px,
                          transparent 4px,
                          transparent 11px,
                          rgba(120, 80, 40, 0.2) 11px,
                          rgba(120, 80, 40, 0.2) 12px
                        ),
                        repeating-linear-gradient(
                          ${index === 0 ? "92deg" : "88deg"},
                          transparent,
                          transparent 19px,
                          rgba(160, 110, 55, 0.15) 19px,
                          rgba(160, 110, 55, 0.15) 20px
                        )
                      `,
                    }}
                  />

                  {/* Cadre exterieur — moulure de porte */}
                  <div className="relative border-[3px] border-[rgba(160,130,80,0.25)] group-hover:border-[rgba(180,150,90,0.45)] transition-all duration-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.05)]"
                    style={{
                      background: "linear-gradient(170deg, rgba(245,238,225,0.85) 0%, rgba(235,225,205,0.7) 40%, rgba(225,215,195,0.65) 100%)",
                    }}
                  >
                    {/* Charnieres — cote gauche pour porte gauche, cote droit pour porte droite */}
                    <div className={`absolute top-[15%] ${index === 0 ? "-left-[6px]" : "-right-[6px]"} z-10`}>
                      <div className="atelier-hinge" />
                    </div>
                    <div className={`absolute top-[50%] ${index === 0 ? "-left-[6px]" : "-right-[6px]"} z-10 -translate-y-1/2`}>
                      <div className="atelier-hinge" />
                    </div>
                    <div className={`absolute top-[85%] ${index === 0 ? "-left-[6px]" : "-right-[6px]"} z-10 -translate-y-full`}>
                      <div className="atelier-hinge" />
                    </div>

                    {/* Panneau interieur — moulure encadree */}
                    <div className="m-4 sm:m-5 lg:m-6">
                      <div
                        className="relative border border-[rgba(160,130,80,0.2)] group-hover:border-[rgba(180,150,90,0.35)] transition-all duration-700"
                        style={{
                          boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.04), inset -1px -1px 0 rgba(255,255,255,0.25), 1px 1px 2px rgba(0,0,0,0.03)",
                          background: "linear-gradient(175deg, rgba(250,245,235,0.5) 0%, rgba(240,233,218,0.3) 100%)",
                        }}
                      >
                        {/* Second panneau interieur — rainure classique */}
                        <div className="m-3 sm:m-4"
                          style={{
                            boxShadow: "inset 0 0 0 1px rgba(160,130,80,0.1)",
                          }}
                        >
                          <div className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 flex flex-col items-center justify-center text-center relative">

                            {/* Ornement haut */}
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-8 sm:w-12 h-px bg-[rgba(160,130,80,0.3)] group-hover:bg-[rgba(180,150,90,0.5)] group-hover:w-14 sm:group-hover:w-16 transition-all duration-700" />
                              <div className="w-1.5 h-1.5 rotate-45 border border-[rgba(160,130,80,0.35)] group-hover:border-[rgba(180,150,90,0.55)] transition-all duration-500" />
                              <div className="w-8 sm:w-12 h-px bg-[rgba(160,130,80,0.3)] group-hover:bg-[rgba(180,150,90,0.5)] group-hover:w-14 sm:group-hover:w-16 transition-all duration-700" />
                            </div>

                            {/* Oeuvre encadree — caisse americaine */}
                            <div className="w-[70%] sm:w-[65%] mx-auto mb-6 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                              <AmericanFrame
                                src={door.previewImage}
                                alt={`${door.label} — apercu`}
                                imageWidth={door.previewWidth}
                                imageHeight={door.previewHeight}
                                frameColor={door.frameColor}
                                className="w-full"
                              />
                            </div>

                            {/* Titre principal */}
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight tracking-[0.2em] uppercase text-[rgb(80,65,45)] group-hover:text-[rgb(60,48,30)] transition-colors duration-500">
                              {door.label}
                            </h2>

                            {/* Sous-titre */}
                            <p className="mt-3 text-xs sm:text-sm font-light tracking-[0.15em] text-[rgba(120,100,70,0.6)] group-hover:text-[rgba(100,80,50,0.8)] transition-colors duration-500">
                              {door.subtitle}
                            </p>

                            {/* Ornement bas */}
                            <div className="flex items-center gap-3 mt-6">
                              <div className="w-8 sm:w-12 h-px bg-[rgba(160,130,80,0.3)] group-hover:bg-[rgba(180,150,90,0.5)] group-hover:w-14 sm:group-hover:w-16 transition-all duration-700" />
                              <div className="w-1.5 h-1.5 rotate-45 border border-[rgba(160,130,80,0.35)] group-hover:border-[rgba(180,150,90,0.55)] transition-all duration-500" />
                              <div className="w-8 sm:w-12 h-px bg-[rgba(160,130,80,0.3)] group-hover:bg-[rgba(180,150,90,0.5)] group-hover:w-14 sm:group-hover:w-16 transition-all duration-700" />
                            </div>

                            {/* Texte "Entrer" au hover */}
                            <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                              <span className="text-xs tracking-[0.3em] uppercase text-[rgba(160,130,80,0.7)]">
                                Entrer
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Poignee de porte — cote oppose aux charnieres */}
                    <div className={`absolute top-1/2 -translate-y-1/2 ${index === 0 ? "right-7 sm:right-8" : "left-7 sm:left-8"} z-10`}>
                      <div className="atelier-handle group-hover:atelier-handle-hover">
                        {/* Rosace */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[rgba(160,130,80,0.3)] group-hover:border-[rgba(180,150,90,0.5)] transition-all duration-500 flex items-center justify-center"
                          style={{
                            background: "radial-gradient(circle at 40% 35%, rgba(220,200,165,0.6) 0%, rgba(190,165,120,0.3) 50%, rgba(160,130,80,0.15) 100%)",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.3)",
                          }}
                        >
                          {/* Trou de serrure stylise */}
                          <div className="flex flex-col items-center gap-[2px]">
                            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-[rgba(120,95,55,0.35)] group-hover:border-[rgba(140,110,65,0.5)] transition-all duration-500" />
                            <div className="w-[3px] h-2 sm:h-2.5 rounded-b-sm bg-[rgba(120,95,55,0.2)] group-hover:bg-[rgba(140,110,65,0.35)] transition-all duration-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
