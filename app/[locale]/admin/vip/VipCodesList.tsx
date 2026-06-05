"use client";

import { useTranslations } from "next-intl";
import { getCodeStatus, formatTime, type VipCode } from "@/lib/vip/format";

interface VipCodesListProps {
  codes: VipCode[];
  loading: boolean;
}

/**
 * Liste des codes VIP actifs/utilises/expires.
 *
 * Composant de presentation pur : recoit les codes et l'etat de chargement
 * via props, n'effectue aucun fetch. `timeRemaining` reste ici car il depend
 * des traductions (useTranslations).
 */
export default function VipCodesList({ codes, loading }: VipCodesListProps) {
  const t = useTranslations("adminVip");

  function timeRemaining(expiresAt: string): string {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return t("status.expired");
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h${minutes.toString().padStart(2, "0")} ${t("remaining")}`;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="border-t border-white/10 pt-8">
        <p className="text-white/40 text-xs tracking-[0.2em] uppercase font-light mb-6">
          {t("activeCodes")}
        </p>

        {loading ? (
          <p className="text-white/20 text-sm text-center">{t("loading")}</p>
        ) : codes.length === 0 ? (
          <p className="text-white/20 text-sm text-center">{t("noActiveCodes")}</p>
        ) : (
          <div className="space-y-4">
            {codes.map((code) => {
              const status = getCodeStatus(code);
              return (
                <div
                  key={code.code}
                  className="flex items-center justify-between py-3 border-b border-white/5"
                >
                  <div>
                    <p className="text-sm font-light tracking-[0.3em]">{code.code}</p>
                    <p className="text-white/30 text-xs mt-1">
                      {formatTime(code.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    {status === "active" && (
                      <>
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/60 mr-2" />
                        <span className="text-white/40 text-xs">
                          {timeRemaining(code.expiresAt)}
                        </span>
                      </>
                    )}
                    {status === "used" && (
                      <span className="text-white/20 text-xs tracking-wide">
                        {t("status.used")}
                      </span>
                    )}
                    {status === "expired" && (
                      <span className="text-white/20 text-xs tracking-wide">
                        {t("status.expired")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
