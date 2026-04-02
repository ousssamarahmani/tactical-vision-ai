import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormStripProps {
  form: string[];
  teamName: string;
}

export function FormStrip({ form, teamName }: FormStripProps) {
  const wins = form.filter(r => r === 'W').length;
  const draws = form.filter(r => r === 'D').length;
  const losses = form.filter(r => r === 'L').length;
  const winRate = Math.round((wins / form.length) * 100);

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Form — Last {form.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="flex gap-1.5">
          {form.map((r, i) => (
            <div
              key={i}
              className={`h-8 w-8 rounded-md text-xs font-bold flex items-center justify-center transition-transform hover:scale-110 ${
                r === 'W'
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : r === 'D'
                  ? 'bg-muted text-muted-foreground border border-border'
                  : 'bg-destructive/15 text-destructive border border-destructive/30'
              }`}
            >
              {r}
            </div>
          ))}
        </div>
        <div className="flex gap-4 text-xs">
          <span className="text-primary font-semibold">{wins}W</span>
          <span className="text-muted-foreground font-medium">{draws}D</span>
          <span className="text-destructive font-semibold">{losses}L</span>
          <span className="text-foreground/70 ml-auto">{winRate}% win rate</span>
        </div>
      </CardContent>
    </Card>
  );
}
