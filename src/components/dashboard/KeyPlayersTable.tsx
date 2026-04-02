import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface KeyPlayersTableProps {
  players: Array<{
    name: string;
    position: string;
    number: number;
    strengths: string[];
    weaknesses: string[];
  }>;
}

export function KeyPlayersTable({ players }: KeyPlayersTableProps) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Key Players
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-[10px] uppercase tracking-wider w-8">#</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Player</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider">Pos</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider hidden sm:table-cell">Strengths</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider hidden sm:table-cell">Weaknesses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((p) => (
              <TableRow key={p.number} className="border-border/30">
                <TableCell className="text-xs font-mono text-muted-foreground py-2">{p.number}</TableCell>
                <TableCell className="text-xs font-medium text-foreground py-2">{p.name}</TableCell>
                <TableCell className="py-2">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{p.position}</Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell py-2">
                  <div className="flex flex-wrap gap-1">
                    {p.strengths.slice(0, 2).map((s, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] px-1.5 py-0 border-primary/30 text-primary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell py-2">
                  <div className="flex flex-wrap gap-1">
                    {p.weaknesses.slice(0, 2).map((w, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] px-1.5 py-0 border-accent/30 text-accent">
                        {w}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
