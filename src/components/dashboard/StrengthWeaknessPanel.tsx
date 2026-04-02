import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface StrengthWeaknessPanelProps {
  strengths: string[];
  weaknesses: string[];
}

export function StrengthWeaknessPanel({ strengths, weaknesses }: StrengthWeaknessPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          {strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span className="text-foreground/90">{s}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            Weaknesses
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          {weaknesses.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
              <span className="text-foreground/90">{w}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
