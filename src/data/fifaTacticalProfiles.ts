/**
 * FIFA-derived qualitative tactical profiles for five national sides.
 *
 * SOURCE MODEL: FIFA World Cup 2026 Post-Match Summary Reports (the "Phases of
 * Play" In/Out-of-Possession percentages, headline xG / PPDA / xT metrics and
 * line-height data as seen in the official PMSR template).
 *
 * The raw FIFA figures are held privately in `SRC` below purely so the
 * conversion is auditable. Everything EXPORTED is qualitative only — no numbers
 * — matching the analyst brief and the DRC Tactical Intelligence house style.
 */

import {
  describePhase, describeXG, describePPDA, describeXT, describeLineHeight,
} from '@/lib/qualitative';

// ---------------------------------------------------------------------------
// Private FIFA-style source figures (never exported, never rendered directly).
// ---------------------------------------------------------------------------
interface PhaseSrc {
  // In possession (% of match phases)
  buildUpUnopposed: number; buildUpOpposed: number; progression: number;
  finalThird: number; longBall: number; attackingTransition: number;
  counterAttack: number; setPiece: number;
  // Out of possession (% of match phases)
  highPress: number; midPress: number; lowPress: number;
  highBlock: number; midBlock: number; lowBlock: number;
  recovery: number; defensiveTransition: number; counterPress: number;
  // Headline metrics
  xg: number; ppda: number; xt: number; lineHeight: number;
}

interface TeamSrc {
  id: string;
  name: string;
  formation: string;
  identity: string[];
  src: PhaseSrc;
  strengths: string[];
  weaknesses: string[];
  risk: string;
  recommendation: string;
  structure: string;
  keyPlayers: Array<{ name: string; role: string; strength: string; weakness: string; instruction: string }>;
  attackingTransition: string;
  defensiveTransition: string;
  setPiece: string;
  matchPlan: { inPossession: string[]; outOfPossession: string[]; pressingTriggers: string[]; dangerZones: string[] };
  riskZones: string[];
  preMatch: { early: string; mid: string; late: string };
  postMatch: string;
}

const TEAMS: TeamSrc[] = [
  {
    id: 'intl_fra',
    name: 'France',
    formation: '4-2-3-1 in possession, shifting to a compact 4-4-2 out of possession',
    identity: [
      'Transition-oriented side with elite individual quality in wide areas.',
      'Comfortable ceding possession to strike on the counter.',
      'Direct vertical progression through the half-spaces.',
    ],
    src: { buildUpUnopposed: 34, buildUpOpposed: 12, progression: 17, finalThird: 14, longBall: 4, attackingTransition: 16, counterAttack: 3, setPiece: 5,
      highPress: 6, midPress: 5, lowPress: 1, highBlock: 5, midBlock: 22, lowBlock: 18, recovery: 6, defensiveTransition: 15, counterPress: 9,
      xg: 1.7, ppda: 10.5, xt: 1.25, lineHeight: 41 },
    strengths: ['Devastating attacking transitions', 'Individual match-winners in wide zones', 'Defensive compactness in a mid-block'],
    weaknesses: ['Can be passive in sustained build-up', 'Full-backs leave space when advanced', 'Reliant on moments of individual quality'],
    risk: 'High threat of counter-attack — the primary route to being hurt.',
    recommendation: 'Control tempo in settled possession and protect against transition; deny the space in behind the defensive line.',
    structure: 'Double pivot anchors central areas while the front four rotates fluidly; defensively the block folds into two banks of four with narrow spacing.',
    keyPlayers: [
      { name: 'Kylian Mbappé', role: 'Left forward / transition spearhead', strength: 'Elite pace in behind', weakness: 'Limited defensive tracking', instruction: 'Deny the space behind the last line; screen the diagonal service to him.' },
      { name: 'Aurélien Tchouaméni', role: 'Deep pivot', strength: 'Screens and recycles', weakness: 'Can be pinned when isolated', instruction: 'Occupy him with a runner from midfield to slow the first counter pass.' },
      { name: 'Antoine Griezmann', role: 'Connector / free 8', strength: 'Links phases and finds pockets', weakness: 'Drifts out of defensive shape', instruction: 'Cut the central supply line to him early.' },
    ],
    attackingTransition: 'Breaks at speed the instant possession is regained, hunting the channel between full-back and centre-back within the first few seconds.',
    defensiveTransition: 'Retreats quickly into a mid-block rather than counter-pressing intensely; occasional disorganisation immediately after losing the ball high.',
    setPiece: 'A measured but genuine set-piece threat, favouring near-post movement and second-phase deliveries.',
    matchPlan: {
      inPossession: ['Circulate patiently to draw the block narrow, then switch to isolate their advanced full-back.', 'Commit runners beyond the striker to pin the double pivot.'],
      outOfPossession: ['Set a rest-defence to nullify the first transition pass.', 'Shadow the connector to sever central links.'],
      pressingTriggers: ['Backward passes toward the goalkeeper.', 'Loose first touch in the opposed build-up phase.'],
      dangerZones: ['Space in behind the defensive line.', 'The wide channel vacated by their attacking full-back.'],
    },
    riskZones: ['Transition moments after our own attacks break down.', 'Isolated 1v1 duels against their wide forwards.'],
    preMatch: { early: 'Establish territorial control and set a disciplined rest-defence from kick-off.', mid: 'Rotate the ball to stretch their mid-block and force them to defend for long spells.', late: 'Guard against fresh pace introduced from the bench in the closing stages.' },
    postMatch: 'Review the number and quality of transitions conceded and the discipline of the rest-defence against direct vertical runs.',
  },
  {
    id: 'intl_esp',
    name: 'Spain',
    formation: '4-3-3 possession base with a single pivot and high full-backs',
    identity: [
      'Possession-dominant side that suffocates opponents through positional play.',
      'Relentless build-up and progression in short, controlled phases.',
      'Immediate counter-press on loss of the ball.',
    ],
    src: { buildUpUnopposed: 30, buildUpOpposed: 16, progression: 20, finalThird: 15, longBall: 2, attackingTransition: 9, counterAttack: 1, setPiece: 4,
      highPress: 9, midPress: 4, lowPress: 0, highBlock: 8, midBlock: 14, lowBlock: 6, recovery: 5, defensiveTransition: 8, counterPress: 13,
      xg: 1.9, ppda: 7.5, xt: 1.3, lineHeight: 52 },
    strengths: ['Suffocating ball retention', 'Aggressive high press and counter-press', 'Positional discipline in build-up'],
    weaknesses: ['High defensive line exposed to pace in behind', 'Space in front of a lone pivot', 'Can be slow to convert dominance into goals'],
    risk: 'High line and high commitment leave clear vulnerability to direct balls in behind.',
    recommendation: 'Absorb pressure in a disciplined block and attack the space behind their high line with direct, vertical passes on turnover.',
    structure: 'Full-backs invert or push high to form a build-up rest-shape; the lone pivot conducts circulation while the front line pins the opposition back four.',
    keyPlayers: [
      { name: 'Rodri', role: 'Single pivot / metronome', strength: 'Dictates rhythm and screens', weakness: 'Leaves gaps when dragged wide', instruction: 'Position a forward to occupy him and cut the first build-up outlet.' },
      { name: 'Pedri', role: 'Progressive interior', strength: 'Receives under pressure and progresses', weakness: 'Less impactful defending deep', instruction: 'Press on his first touch to prevent forward turns.' },
      { name: 'Lamine Yamal', role: 'Right winger', strength: 'Isolated 1v1 threat', weakness: 'Defensive workload', instruction: 'Double up on his side and attack the space he leaves.' },
    ],
    attackingTransition: 'Prefers to re-establish possession rather than counter directly; transitions are used to sustain pressure, not to strike quickly.',
    defensiveTransition: 'Counter-presses immediately and aggressively to win the ball back within seconds of losing it.',
    setPiece: 'A modest set-piece threat relative to their open-play dominance; more dangerous through worked short routines.',
    matchPlan: {
      inPossession: ['Play direct into the space behind the high line at the first opportunity.', 'Retain the ball in wide areas to relieve pressure and draw their press.'],
      outOfPossession: ['Defend in a compact mid-to-low block and stay patient.', 'Block central progression to force play into wide, less dangerous zones.'],
      pressingTriggers: ['Only press selectively on poor square passes; do not chase the ball.'],
      dangerZones: ['The half-spaces where their interiors receive.', 'Sustained overloads on either flank.'],
    },
    riskZones: ['Being drawn out of a compact shape and pressed into turnovers.', 'The lone pivot receiving unopposed to switch play.'],
    preMatch: { early: 'Weather the initial pressure with a disciplined low block; do not concede early.', mid: 'Pick moments to break directly in behind their line when possession is won.', late: 'Maintain concentration; they sustain pressure for the full match.' },
    postMatch: 'Assess how effectively direct balls exploited the space behind the high line and the block\'s discipline under sustained possession.',
  },
  {
    id: 'intl_eng',
    name: 'England',
    formation: '4-2-3-1 with a double pivot and wide creators',
    identity: [
      'Structured, controlled side balancing possession with wide penetration.',
      'Patient build-up feeding creative wide players.',
      'Strong aerial and set-piece presence.',
    ],
    src: { buildUpUnopposed: 33, buildUpOpposed: 13, progression: 18, finalThird: 13, longBall: 3, attackingTransition: 12, counterAttack: 2, setPiece: 6,
      highPress: 7, midPress: 5, lowPress: 1, highBlock: 6, midBlock: 20, lowBlock: 12, recovery: 6, defensiveTransition: 13, counterPress: 10,
      xg: 1.6, ppda: 9.5, xt: 1.2, lineHeight: 44 },
    strengths: ['Depth of creative quality in wide areas', 'Aerial and set-piece dominance', 'Balanced, controlled build-up'],
    weaknesses: ['Can become predictable and slow in settled possession', 'Space between the double pivot on transition', 'Occasionally passive without the ball'],
    risk: 'Moderate — most vulnerable through central transitions and second balls.',
    recommendation: 'Congest central areas, contest second balls aggressively, and exploit the gaps around the double pivot when they overcommit.',
    structure: 'Double pivot provides a stable base; wide players hold width while full-backs support underlaps; defends in two compact banks.',
    keyPlayers: [
      { name: 'Jude Bellingham', role: 'Advanced 8 / arriving threat', strength: 'Late runs into the box', weakness: 'Vacates midfield on the break', instruction: 'Track his forward runs man-to-man from deep.' },
      { name: 'Declan Rice', role: 'Deep pivot', strength: 'Ball-winning and progression', weakness: 'Exposed when partner steps out', instruction: 'Overload the pivot line to create a spare man.' },
      { name: 'Bukayo Saka', role: 'Right winger', strength: 'Cut-ins and cutbacks', weakness: 'Leaves the right channel open', instruction: 'Attack the space behind him with early runs.' },
    ],
    attackingTransition: 'Transitions with intent through wide outlets but generally prioritises retaining structure over reckless commitment.',
    defensiveTransition: 'Recovers into a mid-block promptly; can show gaps around the pivot before the block re-forms.',
    setPiece: 'A major set-piece threat — well-drilled routines and dominant aerial targets at both ends.',
    matchPlan: {
      inPossession: ['Progress through central overloads to exploit space around the pivot.', 'Attack the channel behind their advancing full-backs.'],
      outOfPossession: ['Stay compact centrally and force play wide.', 'Defend set-pieces with disciplined marking of aerial targets.'],
      pressingTriggers: ['Backward and lateral passes in their build-up phase.'],
      dangerZones: ['Wide cutbacks from the by-line.', 'Second balls around set-pieces.'],
    },
    riskZones: ['Aerial situations and set-piece deliveries.', 'Late arrivals into the box from midfield.'],
    preMatch: { early: 'Match their structure and contest the first set-pieces decisively.', mid: 'Break their rhythm by pressing the pivot and denying wide service.', late: 'Stay alert to aerial substitutes and set-piece variations.' },
    postMatch: 'Review set-piece defending and how well central areas were protected against arriving runners.',
  },
  {
    id: 'intl_por',
    name: 'Portugal',
    formation: '4-3-3 tilting to 4-2-3-1, possession-led with wide overloads',
    identity: [
      'Possession-based side with individual brilliance in the final third.',
      'Patient progression seeking wide overloads and cutbacks.',
      'Comfortable in prolonged build-up phases.',
    ],
    src: { buildUpUnopposed: 36, buildUpOpposed: 14, progression: 19, finalThird: 14, longBall: 3, attackingTransition: 8, counterAttack: 2, setPiece: 4,
      highPress: 6, midPress: 5, lowPress: 1, highBlock: 6, midBlock: 18, lowBlock: 10, recovery: 5, defensiveTransition: 11, counterPress: 11,
      xg: 1.75, ppda: 9.0, xt: 1.22, lineHeight: 46 },
    strengths: ['Technical control in build-up', 'Creative overloads and cutback delivery', 'Elite finishing quality in the box'],
    weaknesses: ['Susceptible to pace on the counter', 'Ageing legs can be exposed in transition', 'Over-reliance on wide combinations'],
    risk: 'Moderate-high — vulnerable when possession breaks down into open transition.',
    recommendation: 'Defend compactly, deny the cutback, and counter quickly into the space their committed full-backs leave behind.',
    structure: 'Interiors rotate to create wide overloads; full-backs provide width and depth, leaving space in behind that can be attacked on the break.',
    keyPlayers: [
      { name: 'Bruno Fernandes', role: 'Advanced playmaker', strength: 'Line-breaking passes', weakness: 'Can be caught upfield', instruction: 'Screen his forward passing lanes and press on receipt.' },
      { name: 'Rafael Leão', role: 'Left winger', strength: 'Dribbling in isolation', weakness: 'Inconsistent defensive effort', instruction: 'Show him inside onto cover and attack his flank in transition.' },
      { name: 'Vitinha', role: 'Deep-lying conductor', strength: 'Controls tempo', weakness: 'Physically pressable', instruction: 'Apply direct pressure to disrupt circulation rhythm.' },
    ],
    attackingTransition: 'Generally slower to break, preferring to reset into possession, though the wide forwards can strike quickly in isolation.',
    defensiveTransition: 'Counter-presses in wide traps but leaves exploitable space centrally when the trap is bypassed.',
    setPiece: 'A moderate set-piece threat, most dangerous through worked deliveries to late-arriving runners.',
    matchPlan: {
      inPossession: ['Break at pace into the space behind advancing full-backs.', 'Bypass their press with early direct passes to a holding forward.'],
      outOfPossession: ['Deny the wide overload by staying compact and doubling the flanks.', 'Protect the cutback zone at the top of the box.'],
      pressingTriggers: ['Slow, sideways circulation from the deep conductor.'],
      dangerZones: ['Cutbacks to the penalty spot.', 'Isolated 1v1s against their wide forwards.'],
    },
    riskZones: ['Wide overloads culminating in cutbacks.', 'Individual moments from their front line.'],
    preMatch: { early: 'Set a compact block and refuse to be drawn out by their circulation.', mid: 'Pick transition moments to exploit the space their full-backs vacate.', late: 'Guard against late set-piece and cutback situations as they chase the game.' },
    postMatch: 'Review how well the cutback zone was protected and the quality of counters into vacated full-back space.',
  },
  {
    id: 'intl_ger',
    name: 'Germany',
    formation: '4-2-3-1 / 3-2-5 in possession with inverted full-backs',
    identity: [
      'Positional, possession-dominant side that builds through structured overloads.',
      'Aggressive rest-defence enabling immediate counter-press.',
      'Patient central progression before wide penetration.',
    ],
    src: { buildUpUnopposed: 35, buildUpOpposed: 15, progression: 19, finalThird: 13, longBall: 2, attackingTransition: 10, counterAttack: 1, setPiece: 5,
      highPress: 8, midPress: 5, lowPress: 0, highBlock: 7, midBlock: 16, lowBlock: 8, recovery: 5, defensiveTransition: 9, counterPress: 12,
      xg: 1.65, ppda: 8.0, xt: 1.24, lineHeight: 49 },
    strengths: ['Structured possession and positional overloads', 'Aggressive counter-press and rest-defence', 'Depth of technical midfield quality'],
    weaknesses: ['High line vulnerable to direct balls in behind', 'Inverted full-backs leave wide space on transition', 'Can lack a focal point in the box'],
    risk: 'Moderate-high — the high, aggressive shape can be attacked directly in behind and in the wide channels.',
    recommendation: 'Stay compact, break their counter-press with a clean first pass, and target the wide channels their inverted full-backs vacate.',
    structure: 'Full-backs invert into midfield to form a 3-2-5 build-up shape; the front five occupies all five lanes, leaving the flanks open to fast wide transitions.',
    keyPlayers: [
      { name: 'Jamal Musiala', role: 'Left interior / dribble threat', strength: 'Carries through tight spaces', weakness: 'Can be dispossessed high', instruction: 'Double-team on his receipt and counter through the space he leaves.' },
      { name: 'Joshua Kimmich', role: 'Inverted full-back / build-up hub', strength: 'Controls build-up and switches', weakness: 'Vacated flank behind him', instruction: 'Attack the wide space behind his inverted position at speed.' },
      { name: 'Florian Wirtz', role: 'Free 10', strength: 'Between-lines creativity', weakness: 'Limited defensive tracking', instruction: 'Deny him time between the lines with a dedicated screen.' },
    ],
    attackingTransition: 'Uses transitions to reload possession and pin opponents, rather than sprinting directly at goal.',
    defensiveTransition: 'Counter-presses with high intensity through a well-set rest-defence; if the first press is beaten, the wide channels are exposed.',
    setPiece: 'A reliable set-piece threat with well-designed routines, though not their primary weapon.',
    matchPlan: {
      inPossession: ['Escape the counter-press with one clean vertical pass, then attack the open flanks.', 'Target the space behind the high line with timed runs.'],
      outOfPossession: ['Stay compact centrally to nullify the between-lines creator.', 'Hold width to punish the inverted full-back structure on turnover.'],
      pressingTriggers: ['Overloaded build-up when the goalkeeper is forced into a hurried pass.'],
      dangerZones: ['The wide channels behind inverted full-backs.', 'Space in behind the aggressive high line.'],
    },
    riskZones: ['Losing the ball into their organised counter-press.', 'Their free 10 receiving between the lines.'],
    preMatch: { early: 'Absorb their early possession pressure without losing shape.', mid: 'Exploit the wide channels and the space in behind on every transition.', late: 'Maintain positional discipline as they commit numbers forward.' },
    postMatch: 'Review escape quality against the counter-press and how consistently the vacated wide channels were exploited.',
  },
];

// ---------------------------------------------------------------------------
// Public, qualitative-only profile shape.
// ---------------------------------------------------------------------------
export interface FifaTacticalProfile {
  id: string;
  name: string;
  formation: string;
  identity: string[];
  executiveSummary: { identity: string[]; strengths: string[]; weaknesses: string[]; risk: string; recommendation: string };
  structuralBehaviour: string;
  inPossession: string[];
  outOfPossession: string[];
  metrics: { attackingThreat: string; pressingIntensity: string; progressionThreat: string; blockHeight: string };
  transitions: { attacking: string; defensive: string };
  setPiece: string;
  keyPlayers: Array<{ name: string; role: string; strength: string; weakness: string; instruction: string }>;
  strengths: string[];
  weaknesses: string[];
  matchPlan: { inPossession: string[]; outOfPossession: string[]; pressingTriggers: string[]; dangerZones: string[] };
  riskZones: string[];
  preMatch: { early: string; mid: string; late: string };
  postMatch: string;
}

function build(t: TeamSrc): FifaTacticalProfile {
  const s = t.src;
  const inPossession = [
    describePhase('Unopposed build-up', s.buildUpUnopposed, 'constructs play from the back unpressured'),
    describePhase('Opposed build-up', s.buildUpOpposed, 'plays out under pressure'),
    describePhase('Progression', s.progression, 'moves the ball through the thirds in controlled phases'),
    describePhase('Final third', s.finalThird, 'sustains attacks in the final third'),
    describePhase('Long ball', s.longBall, 'resorts to direct long play'),
    describePhase('Attacking transition', s.attackingTransition, 'attacks on the transition'),
    describePhase('Counter attack', s.counterAttack, 'launches outright counter-attacks'),
    describePhase('Set piece', s.setPiece, 'generates phases from set plays'),
  ];
  const outOfPossession = [
    describePhase('High press', s.highPress, 'presses high up the pitch'),
    describePhase('Mid press', s.midPress, 'engages the press in midfield'),
    describePhase('Low press', s.lowPress, 'presses from a deep starting point'),
    describePhase('High block', s.highBlock, 'defends from a high block'),
    describePhase('Mid block', s.midBlock, 'defends from a mid-block'),
    describePhase('Low block', s.lowBlock, 'drops into a low block'),
    describePhase('Recovery', s.recovery, 'is recovering shape after being stretched'),
    describePhase('Defensive transition', s.defensiveTransition, 'is exposed in defensive transition'),
    describePhase('Counter-press', s.counterPress, 'counter-presses on loss of the ball'),
  ];
  return {
    id: t.id,
    name: t.name,
    formation: t.formation,
    identity: t.identity,
    executiveSummary: { identity: t.identity, strengths: t.strengths, weaknesses: t.weaknesses, risk: t.risk, recommendation: t.recommendation },
    structuralBehaviour: t.structure,
    inPossession,
    outOfPossession,
    metrics: {
      attackingThreat: describeXG(s.xg),
      pressingIntensity: describePPDA(s.ppda),
      progressionThreat: describeXT(s.xt),
      blockHeight: describeLineHeight(s.lineHeight),
    },
    transitions: { attacking: t.attackingTransition, defensive: t.defensiveTransition },
    setPiece: t.setPiece,
    keyPlayers: t.keyPlayers,
    strengths: t.strengths,
    weaknesses: t.weaknesses,
    matchPlan: t.matchPlan,
    riskZones: t.riskZones,
    preMatch: t.preMatch,
    postMatch: t.postMatch,
  };
}

export const fifaTacticalProfiles: FifaTacticalProfile[] = TEAMS.map(build);

export function getFifaProfile(teamId: string): FifaTacticalProfile | undefined {
  return fifaTacticalProfiles.find((p) => p.id === teamId);
}
