import type { AdminStats } from '@/hooks/useAdminPhotos';

interface AdminStatsGridProps {
  stats: AdminStats;
}

const STAT_CARDS = [
  { key: 'total', label: 'Total', borderClass: 'border-border', textClass: 'text-foreground' },
  { key: 'visible', label: 'Visibles', borderClass: 'border-primary/30', textClass: 'text-primary' },
  { key: 'forSale', label: 'À vendre', borderClass: 'border-green-500/30', textClass: 'text-green-500' },
  { key: 'limitedEditions', label: 'Éditions limitées', borderClass: 'border-purple-500/30', textClass: 'text-purple-500' },
  { key: 'soldOut', label: 'Épuisées', borderClass: 'border-orange-500/30', textClass: 'text-orange-500' },
] as const;

export default function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-16">
      {STAT_CARDS.map(({ key, label, borderClass, textClass }) => (
        <div key={key} className={`bg-card border ${borderClass} rounded-lg p-6 md:p-8`}>
          <div className={`text-3xl md:text-4xl font-light ${textClass} mb-2`}>
            {stats[key]}
          </div>
          <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
            {label}
          </div>
        </div>
      ))}
      <div className="bg-card border border-green-500/30 rounded-lg p-6 md:p-8">
        <div className="text-2xl md:text-3xl font-light text-green-500 mb-2">
          {stats.totalValue.toLocaleString('fr-FR')}&euro;
        </div>
        <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
          Valeur totale
        </div>
      </div>
    </div>
  );
}
