

# Plan: Professional PDF Tactical Report Generator

## Problem
The current PDF export uses `html2canvas` to screenshot the dashboard, producing a low-quality raster image. The user wants a real, structured PDF document with proper text, tables, and sections — plus a "Detailed Tactical Report" download option.

## Approach

Replace the screenshot-based PDF with a **programmatically generated PDF using jsPDF** that builds a real document with native text, tables, and layout. Add two download options:

1. **Summary Report** — 1-2 page executive overview (KPIs, form, radar summary)
2. **Detailed Tactical Report** — Full multi-page report including all sections: performance overview, tactical patterns (build-up, attacking, defensive, transitions), strengths & weaknesses analysis, key players scouting, match-by-match breakdown with dates/scores/notes, and spatial analysis descriptions

## Changes

### 1. Create `src/lib/generateReport.ts`
A standalone module that takes `teamData` and `matchesData` and generates a professional PDF using **jsPDF** with native text rendering:

- **Cover Page**: Team name, league, formation, manager, date, "TACTIVISION.AI" branding
- **Section 1 — Performance Overview**: Win rate, avg xG, avg possession as formatted text/table
- **Section 2 — Recent Form**: Match-by-match table with dates, opponents, scores, competitions
- **Section 3 — Strengths & Weaknesses**: Bullet-pointed lists with section headers
- **Section 4 — Tactical Patterns**: Build-up, Attacking, Defensive, Set Pieces, Transitions — each as a titled paragraph
- **Section 5 — Key Players Scouting**: Table with player name, position, number, strengths, weaknesses
- **Section 6 — Match Details**: For each match — date, score, xG, possession, key events, tactical notes
- **Footer**: Page numbers, "Confidential — Tactivision.ai", date

Uses jsPDF's native text APIs (`doc.text`, `doc.setFont`, `doc.line`) for crisp, selectable text. Uses `jspdf-autotable` for proper tables.

### 2. Update `OppositionDashboard.tsx`
- Replace the `html2canvas` screenshot export with the new `generateReport` function
- Add two buttons: **"Download Summary"** and **"Download Tactical Report"** (detailed)
- Remove `reportRef` since we no longer screenshot the DOM
- Pass match data into the component or import it directly

### 3. Install `jspdf-autotable`
Add dependency for professional table rendering in the PDF.

## Technical Details
- **jsPDF native text** ensures selectable, searchable, print-quality PDF
- **jspdf-autotable** plugin handles table layout, pagination, and styling automatically
- Color scheme: dark headers with white text, alternating row colors for readability
- Auto page-break management for long content sections

