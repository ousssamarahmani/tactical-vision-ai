import { KPICard } from './KPICard';
import { TacticalRadar } from './TacticalRadar';
import { MatchStatsChart } from './MatchStatsChart';
import { StrengthWeaknessPanel } from './StrengthWeaknessPanel';
import { KeyPlayersTable } from './KeyPlayersTable';
import { FormStrip } from './FormStrip';
import { PitchHeatmap } from '@/components/PitchHeatmap';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Swords, TrendingUp, Target } from 'lucide-react';
import matchesData from '@/data/matches.json';

interface TeamData {
  id: string;
  name: string;
  league: string;
  manager: string;
  formation: string;
  style: string;
  key_players: Array<{
    name: string;
    position: string;
    number: number;
    strengths: string[];
    weaknesses: string[];
  }>;
  tactical_patterns: {
    build_up: string;
    attacking: string;
    defensive: string;
    transitions: string;
  };
  strengths: string[];
  weaknesses: string[];
  recent_form: string[];
}

interface OppositionDashboardProps {
  teamData: TeamData;
}

export function OppositionDashboard({ teamData }: OppositionDashboardProps) {
  const teamMatches = matchesData.filter(
    m => m.home_team === teamData.id || m.away_team === teamData.id
  );

  const wins = teamData.recent_form.filter(r => r === 'W').length;
  const winRate = Math.round((wins / teamData.recent_form.length) * 100);

  const avgXG = teamMatches.length > 0
    ? (teamMatches.reduce((sum, m) => {
        const isHome = m.home_team === teamData.id;
        return sum + (isHome ? m.xg.home : m.xg.away);
      }, 0) / teamMatches.length).toFixed(2)
    : '—';

  const avgPossession = teamMatches.length > 0
    ? Math.round(teamMatches.reduce((sum, m) => {
        const isHome = m.home_team === teamData.id;
        return sum + (isHome ? m.possession.home : m.possession.away);
      }, 0) / teamMatches.length)
    : 0;

  return (
    <div className="space-y-4 overflow-y-auto">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard title="Win Rate" value={`${winRate}%`} subtitle={`Last ${teamData.recent_form.length} games`} icon={TrendingUp} trend={winRate >= 60 ? 'up' : winRate >= 40 ? 'neutral' : 'down'} />
        <KPICard title="Avg xG" value={avgXG} subtitle="Per match" icon={Target} accentColor="hsl(var(--accent))" />
        <KPICard title="Avg Possession" value={`${avgPossession}%`} subtitle="Per match" icon={Swords} accentColor="hsl(var(--chart-3))" />
        <KPICard title="Squad" value={teamData.key_players.length} subtitle="Key players tracked" icon={Users} accentColor="hsl(var(--chart-4))" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TacticalRadar teamData={teamData} />
        <MatchStatsChart matches={teamMatches} teamId={teamData.id} />
      </div>

      {/* Form */}
      <FormStrip form={teamData.recent_form} teamName={teamData.name} />

      {/* Strengths / Weaknesses */}
      <StrengthWeaknessPanel strengths={teamData.strengths} weaknesses={teamData.weaknesses} />

      {/* Key Players */}
      <KeyPlayersTable players={teamData.key_players} />

      {/* Heatmaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <PitchHeatmap teamId={teamData.id} mode="attacking" teamData={teamData} />
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <PitchHeatmap teamId={teamData.id} mode="defensive" teamData={teamData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
