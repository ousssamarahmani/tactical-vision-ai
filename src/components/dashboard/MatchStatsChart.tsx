import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MatchStatsChartProps {
  matches: Array<{
    id: string;
    home_team: string;
    away_team: string;
    date: string;
    competition: string;
    score: string;
    xg: { home: number; away: number };
    possession: { home: number; away: number };
    shots: { home: number; away: number };
    shots_on_target: { home: number; away: number };
  }>;
  teamId: string;
}

export function MatchStatsChart({ matches, teamId }: MatchStatsChartProps) {
  const data = matches.map(m => {
    const isHome = m.home_team === teamId;
    return {
      match: `${m.competition.slice(0, 3)} ${m.date.slice(5)}`,
      xG: isHome ? m.xg.home : m.xg.away,
      xGA: isHome ? m.xg.away : m.xg.home,
      possession: isHome ? m.possession.home : m.possession.away,
      shots: isHome ? m.shots.home : m.shots.away,
    };
  });

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Match xG Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="match" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="xG" name="xG For" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill="hsl(var(--primary))" />
              ))}
            </Bar>
            <Bar dataKey="xGA" name="xG Against" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill="hsl(var(--accent))" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
