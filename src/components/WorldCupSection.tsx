import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Globe, Trophy, Search, Users, CalendarDays, ExternalLink } from 'lucide-react';
import worldCup from '@/data/worldcup2026.json';

type Player = { name: string; position: string; club: string };
type Match = { date: string; opponent: string; competition: string; result: string; score: string };
type Team = {
  name: string; code: string; confederation: string; fifaRank: number;
  manager: string; squad: Player[]; lastMatches: Match[];
};
type Group = { group: string; teams: Team[] };

const data = worldCup as unknown as {
  tournament: string; host: string; source: string; sourceUrl: string;
  snapshotDate: string; groups: Group[];
};

const resultColor = (r: string) =>
  r === 'W' ? 'bg-primary/20 text-primary' :
  r === 'D' ? 'bg-accent/20 text-accent' :
  'bg-destructive/20 text-destructive';

const positionOrder = ['GK', 'DF', 'MF', 'FW'];

function TeamDialog({ team, onClose }: { team: Team | null; onClose: () => void }) {
  const grouped = useMemo(() => {
    if (!team) return [];
    return positionOrder
      .map((pos) => ({ pos, players: team.squad.filter((p) => p.position === pos) }))
      .filter((g) => g.players.length > 0);
  }, [team]);

  return (
    <Dialog open={!!team} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        {team && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <span className="font-mono text-primary">{team.code}</span>
                {team.name}
                <Badge variant="secondary" className="text-[10px]">FIFA #{team.fifaRank}</Badge>
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                {team.confederation} · Manager: <span className="text-foreground font-medium">{team.manager}</span>
              </p>
            </DialogHeader>

            {/* Last 6 matches */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> Last 6 Matches
              </h3>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableBody>
                    {team.lastMatches.map((m, i) => (
                      <TableRow key={i} className="border-border/20">
                        <TableCell className="py-2 text-[11px] font-mono text-muted-foreground w-24">{m.date}</TableCell>
                        <TableCell className="py-2 text-xs font-medium text-foreground">vs {m.opponent}</TableCell>
                        <TableCell className="py-2 text-[10px] text-muted-foreground hidden sm:table-cell">{m.competition}</TableCell>
                        <TableCell className="py-2 text-xs font-mono text-right">{m.score}</TableCell>
                        <TableCell className="py-2 w-10 text-right">
                          <span className={`inline-flex h-5 w-5 rounded text-[10px] font-bold items-center justify-center ${resultColor(m.result)}`}>
                            {m.result}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Squad */}
            <div className="space-y-2 mt-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Current Squad ({team.squad.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {grouped.map(({ pos, players }) => (
                  <div key={pos} className="rounded-lg border border-border/40 p-3">
                    <p className="text-[10px] font-bold text-primary mb-1.5">{pos}</p>
                    <ul className="space-y-1">
                      {players.map((p, i) => (
                        <li key={i} className="flex justify-between gap-2 text-xs">
                          <span className="text-foreground font-medium truncate">{p.name}</span>
                          <span className="text-muted-foreground truncate text-right">{p.club}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function WorldCupSection() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Team | null>(null);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.groups;
    return data.groups
      .map((g) => ({ ...g, teams: g.teams.filter((t) => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)) }))
      .filter((g) => g.teams.length > 0);
  }, [query]);

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <div className="h-[2px] bg-primary" />
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-[0.15em] text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              {data.tournament}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Globe className="h-3 w-3" /> {data.host} · 48 teams · 12 groups
            </p>
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search team..."
              className="pl-8 h-9 text-xs bg-background/50"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((g) => (
            <div key={g.group} className="rounded-lg border border-border/40 bg-background/30 overflow-hidden">
              <div className="px-3 py-2 bg-muted/30 border-b border-border/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Group {g.group}</span>
              </div>
              <ul className="divide-y divide-border/20">
                {g.teams.map((t) => (
                  <li key={t.code}>
                    <button
                      onClick={() => setActive(t)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-muted/30 transition-colors"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono text-primary w-8">{t.code}</span>
                        <span className="text-xs font-medium text-foreground truncate">{t.name}</span>
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {t.lastMatches.slice(0, 5).map((m, i) => (
                          <span key={i} className={`h-3.5 w-3.5 rounded-sm text-[8px] font-bold flex items-center justify-center ${resultColor(m.result)}`}>
                            {m.result}
                          </span>
                        ))}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 pt-1">
          <ExternalLink className="h-3 w-3" />
          {data.source} · snapshot {data.snapshotDate} ·{' '}
          <a href={data.sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Sofascore</a>
        </p>
      </CardContent>
    </Card>
  );
}
