# Prototypes — Odontology UI

All three prototypes were generated with the built-in `imagegen` workflow. They are design
references only: the package implementation uses semantic React, CSS, and accessible HTML rather
than embedding these raster mockups. Patient and clinician details shown in the images are entirely
synthetic.

## 01 — Oral atlas

File: `01-oral-atlas.png`

```text
Use case: ui-mockup
Asset type: high-fidelity desktop Storybook prototype for a French odontology clinical UI component library
Primary request: Design an original longitudinal dental care cockpit centered on an interactive FDI odontogram, with permanent upper and lower arches, clearly selected tooth 16 and selected occlusal surface, dental status symbols plus written labels, a narrow longitudinal history rail, a six-site periodontal mini-chart, and a phased treatment plan. This is a reusable component showcase rather than a whole hospital application.
Scene/backdrop: edge-to-edge desktop clinical workspace on a warm ivory chart-paper surface, no device frame
Style/medium: high-fidelity product UI mockup, editorial scientific atlas meets precise Swiss information design, sophisticated and calm
Composition/framing: 16:10 wide canvas; asymmetric three-column layout; odontogram dominates the left two-thirds; inspector is a vertical specimen card; timeline and treatment phases form a compact right rail; dense but breathable
Lighting/mood: flat interface presentation, quietly authoritative and tactile
Color palette: warm bone, graphite ink, oxidized teal, coral-red clinical alert, muted cobalt for observed data; avoid purple gradients
Materials/textures: subtle graph-paper rules, fine engraved tooth linework, small stamped status glyphs, restrained 1px borders
Text (verbatim): "PARCOURS BUCCO-DENTAIRE", "Dent 16 · face occlusale", "Observation validée", "Plan de traitement", "Historique"
Constraints: all dental states use a symbol and a text label in addition to color; visible keyboard focus; show a compact tabular alternative control; use French UI copy; realistic dental notation; synthetic patient data badge; no photos; no hospital logo; no watermark
Avoid: generic dashboard cards, oversized rounded rectangles, glassmorphism, purple, cartoon teeth, illegible microtext, dependence on hover or color alone
```

## 02 — Chairside instrument panel

File: `02-chairside-instrument-panel.png`

```text
Use case: ui-mockup
Asset type: high-fidelity responsive clinical component-library prototype for a French odontology chairside workflow
Primary request: Design an original chairside odontology command surface focused on rapid keyboard operation during a consultation. Show a mixed-dentition FDI odontogram as two horizontal ribbons, a large tooth-surface inspector for tooth 64 with five selectable faces, an endodontic workbench with canal measurements and observed/projected markers, an extraction safety checklist, and a conflict-of-entry banner with two clearly attributable versions. Include a visible mobile horizontal-scroll affordance.
Scene/backdrop: wide clinical workstation UI on deep midnight-blue technical enamel, no browser or device chrome
Style/medium: high-fidelity product UI mockup, industrial dental instrument panel blended with night-mode cartography, functional rather than futuristic
Composition/framing: 16:10 landscape; strong horizontal bands; selected tooth blooms into a central circular surface map; shortcut ribbon at bottom; endodontic measurements aligned like calibrated instruments; no generic sidebar navigation
Lighting/mood: focused low-light operatory mode, crisp, high-contrast, serious
Color palette: near-black navy, porcelain white, mineral cyan, acid chartreuse focus ring, rust-orange warning, pale lavender only for projected data
Materials/textures: enamel panels, etched calibration ticks, dotted plotting grid, hairline dividers, square and clipped corners
Text (verbatim): "MODE FAUTEUIL", "Dent 64 · denture mixte", "Conflit de saisie", "Mesures canalaires", "Sécurité avant extraction", "Données synthétiques"
Constraints: every status has a shape or symbol and French written label; strong keyboard focus; distinguish observed, imported, projected, preliminary and validated data; accessible tabular alternative button; realistic FDI notation; no photos; no logos; no watermark
Avoid: generic admin dashboard, pastel wellness app, purple gradient, glossy 3D tooth, excessive rounded cards, tiny unreadable labels, color-only meaning, hover-only controls
```

## 03 — Care pathway archive

File: `03-care-pathway-archive.png`

```text
Use case: ui-mockup
Asset type: high-fidelity desktop clinical review prototype for a French odontology component library
Primary request: Design an original multidisciplinary oral-health review board centered on a phased treatment pathway. Show an editorial oral health summary, a compact FDI odontogram strip, a large six-site periodontal chart with recession, bleeding and plaque symbols plus a tabular alternative, an imaging context filmstrip with provenance labels, a prosthesis/implant timeline, orthodontic milestones, and a dental document lifecycle from draft through signature and supersession. Include completed, cancelled and postponed sessions and a consent gate.
Scene/backdrop: full-bleed desktop interface on pale celadon archival paper, no device frame
Style/medium: high-fidelity product UI mockup, medical case conference wall meets contemporary museum archive catalog; refined, modular, diagram-led
Composition/framing: 16:10 landscape; strong vertical treatment pathway spine crossing a modular editorial grid; periodontal plot is the widest panel; odontogram becomes a thin navigational index at top; document lifecycle runs as a stamped footer
Lighting/mood: daylight review room, composed, collaborative, trustworthy
Color palette: pale celadon, forest ink, warm charcoal, saffron for preliminary, brick red for risks, ultramarine for imported imaging, paper white; no purple gradient
Materials/textures: archival paper grain, registration marks, fine rule lines, clipped paper tabs, circular date stamps, precise data plotting
Text (verbatim): "REVUE DE PARCOURS", "Santé orale · synthèse", "Parodonte · 6 sites", "Imagerie et provenance", "Consentement requis", "Cycle documentaire", "Données 100 % synthétiques"
Constraints: every state uses symbol plus French written label in addition to color; distinguish observed, imported, derived, projected, preliminary and validated data; show alternative table access; realistic FDI notation and dates; explicit consent status; no photos of real people; no logos; no watermark
Avoid: generic Kanban board, generic dashboard tiles, huge rounded cards, glassmorphism, purple gradients, cartoon teeth, decorative charts without labels, color-only meaning, unreadable microtext
```

## Selected implementation direction

The component family combines the oral-atlas readability of prototype 01, the chairside keyboard
and conflict behavior of prototype 02, and the provenance/treatment/document semantics of prototype
03. This keeps the visual system cohesive while letting each public component retain a specific
clinical purpose.
