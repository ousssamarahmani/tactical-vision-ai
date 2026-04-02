import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  accentColor?: string;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, accentColor }: KPICardProps) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden relative group hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: accentColor ? `${accentColor}20` : 'hsl(var(--primary) / 0.15)' }}
          >
            <Icon
              className="h-4.5 w-4.5"
              style={{ color: accentColor || 'hsl(var(--primary))' }}
            />
          </div>
        </div>
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <span className={`text-[10px] font-semibold ${
              trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
