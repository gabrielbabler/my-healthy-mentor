---
name: Kinetic Performance
colors:
  surface: '#101419'
  surface-dim: '#101419'
  surface-bright: '#36393f'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c21'
  surface-container: '#1c2025'
  surface-container-high: '#262a30'
  surface-container-highest: '#31353b'
  on-surface: '#e0e2ea'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#e0e2ea'
  inverse-on-surface: '#2d3136'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#89ceff'
  on-secondary: '#00344d'
  secondary-container: '#00a2e6'
  on-secondary-container: '#00344e'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#e29100'
  on-tertiary-container: '#523200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#101419'
  on-background: '#e0e2ea'
  surface-variant: '#31353b'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  metric-display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.03em
  metric-value:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-xs:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system establishes a high-performance athletic intelligence environment tailored for mobile-first Progressive Web Apps. Built for athletes, lifters, and nutrition-conscious individuals navigating low-light gyms and busy kitchen counters, the aesthetic merges the surgical precision of developer-grade component libraries (shadcn/ui) with the biometric authority of modern performance trackers like MacroFactor and Whoop.

The visual tone is disciplined, objective, and ultra-high-contrast. It replaces emotional fluff and playful gradients with sharp data visualization, tabular metrics, and micro-interactions that confirm logging tasks within milliseconds. Deep slate foundations anchor the experience, while energetic emerald signals progression, recovery, and metabolic targets met.

## Colors

The palette operates on high-contrast layered depth, prioritizing legibility and rapid comprehension under rapid workout tempos.

### Foundation & Surfaces
- **Canvas Base (`#090D12`):** Primary viewport backdrop, providing deep black level contrast.
- **Card Surface (`#0E1622`):** Default component elevated surface container.
- **Interactive Elevated Surface (`#141E2E`):** Segmented controls, modals, and active sheet panels.
- **Subtle Hairline Border (`#1E293B`):** Structural partition border for cards, table dividers, and navbars.
- **Interactive Border (`#334155`):** Hover states, input focus rings, and selected boundary treatments.

### Primary Accents & Energy
- **Emerald Core (`#10B981`):** Primary action color, target attainment, macronutrient success, completed workout sets.
- **Emerald Hover (`#059669`):** Pressed/active micro-states.
- **Emerald Subtle (`rgba(16, 185, 129, 0.12)`): Active chip fills, badge backdrops, ring chart track glow.

### Status & Functional Telemetry
- **Sky (`#0EA5E9`):** Hydration metrics, AI coach prompt telemetry, external integrations.
- **Amber (`#F59E0B`):** Pending weekly macro check-ins, weight scale smoothing diffs, delta alerts.
- **Rose (`#F43F5E`):** Deficits exceeding limits, missed training targets, deload alerts.

### Typographic Contrast Hierarchy
- **Foreground Primary (`#F8FAFC`):** Quantitative metrics, headlines, active states.
- **Foreground Muted (`#94A3B8`):** Metric labels, secondary descriptive copy, unselected tabs.
- **Foreground Dim (`#64748B`):** Units (`kcal`, `g`, `kg`), timestamps, placeholder cues.

## Typography

Inter serves as the sole typographic engine, deployed with deliberate weight and tracking variations to enforce clarity.

### Numerical Data & Tabular Figures
All numeric values, weights, repetitions, caloric summaries, and micro-charts must use OpenType tabular numerals: `font-feature-settings: "tnum" 1, "cv05" 1`. This prevents horizontal jitter during rapid real-time counter changes or timer increments.

### Localization & Unit Pairing
In the `pt-BR` locale, numerical groupings conform to standard metric conventions (e.g., `2.450 kcal`, `82,4 kg`, `180 g`). Units are set using `Foreground Dim` (`#64748B`) at one size tier below the associated metric value (e.g., `84,5` in `metric-value` paired with `kg` in `body-sm`).

## Layout & Spacing

The layout model is optimized for handheld single-thumb operation while scaling to structured desktop dashboards.

### Grid & Form Factors
- **Mobile (< 640px):** Single-column vertical stream. Margin is fixed at `1rem` (`16px`) to maximize data density. Content spans edge-to-edge within cards.
- **Tablet (640px - 1024px):** 6-column fluid grid with `1rem` gutters. Metric summaries adopt a 2-column or 3-column modular card layout.
- **Desktop (>= 1025px):** 12-column grid capped at `1200px` max-width. Navigation transitions from mobile bottom tabs to a sticky left rail (`260px` fixed width).

### Layout Rules
- **Safe Area Insets:** The PWA layout rigorously applies `env(safe-area-inset-bottom)` to the sticky navigation bar and input actions.
- **Thumb-Zone Optimization:** High-frequency controls (Log Meal, Complete Set, Quick Add Water) remain anchored within the lower 40% of the mobile viewport.

## Elevation & Depth

Visual hierarchy does not use diffuse blurs or high-offset dropped shadows. Depth is achieved strictly through structural tonal layering and hairline borders (the shadcn paradigm).

### Surface Tiers
1. **Level 0 (Canvas):** `#090D12` — Base viewport background.
2. **Level 1 (Card/Section):** `#0E1622` with a `1px solid #1E293B` border.
3. **Level 2 (Interactive Floating/Overlays):** `#141E2E` with a `1px solid #334155` border. Used for sheets, menus, and popovers.

### Focus & Active Glows
Elevated active states do not cast soft gray drop shadows. Instead, active items exhibit a localized, low-spread color wash:
- `box-shadow: 0 0 0 1px #10B981, 0 0 12px rgba(16, 185, 129, 0.15)` for primary focus rings and active biometric indicators.

## Shapes

The design system uses deliberate, disciplined corners (`roundedness: 1`), keeping elements crisp and surgical rather than overly rounded or playful.

- **Base Radius (`rounded-sm` / 0.25rem - 4px):** Checkboxes, progress segments, badges, and inline status tags.
- **Medium Radius (`rounded-md` / 0.375rem - 6px):** Form inputs, buttons, segmented selector tabs.
- **Large Radius (`rounded-lg` / 0.5rem - 8px):** Primary content cards, modal dialogs, bottom sheets.
- **Pill Exception:** Pure circular boundaries (`rounded-full`) are reserved exclusively for avatar initials, floating metric badges, and adherence status icons.

## Components

### Buttons
- **Primary:** Background `#10B981`, foreground `#090D12` (bold black text ensures maximum contrast on green), border `none`. Hover/active: `#059669`.
- **Secondary / Outline:** Background `transparent`, foreground `#F8FAFC`, border `1px solid #1E293B`. Hover: background `#141E2E`, border `#334155`.
- **Ghost:** Background `transparent`, foreground `#94A3B8`. Hover: foreground `#F8FAFC`, background `#0E1622`.
- **Sizing:** Tap target minimum `44px` height on mobile interfaces.

### Cards
- Constructed with `#0E1622` background, enclosed with `1px solid #1E293B`. Padding uses `space-lg` (`16px`).
- Header regions feature concise labels in `label-xs` uppercase tracking (`#64748B`) followed by prominent numeric values.

### Segmented Controls
- Contained within a `#090D12` container with `1px solid #1E293B` and `0.25rem` padding.
- Inactive segments: `#94A3B8`, no background.
- Active segment: `#141E2E` background, `#F8FAFC` foreground, `1px solid #334155` border.

### Adherence Pills (1-Tap Tracking)
- Compact quick-toggle indicators (e.g., Creatina, Treino, Jejum).
- Inactive: Background `#0E1622`, border `1px solid #1E293B`, icon `#64748B`.
- Completed: Background `rgba(16, 185, 129, 0.12)`, border `1px solid #10B981`, icon/label `#10B981`.

### Diff Comparison Cards
- Used for weekly check-ins and AI macro adjustments (e.g., Carbs: 220g → 205g).
- Split two-column display enclosed in a single card.
- Baseline values are displayed in `#94A3B8` with strikethrough; recommended targets use bold `#F8FAFC` paired with an amber (`#F59E0B`) or emerald (`#10B981`) indicator tag denoting adjustment polarity.

### Input Fields
- Background `#0E1622`, border `1px solid #1E293B`, text `#F8FAFC`, placeholder `#64748B`.
- Focus: Border `#10B981` with ring `rgba(16, 185, 129, 0.15)`.
- Number inputs for gym sets/reps default to large centered tabular fonts with steppers embedded into the container.

### Mobile Bottom Navigation Bar
- Fixed bottom layout with backdrop blur (`#090D12` at 90% opacity with `backdrop-filter: blur(8px)`), top border `1px solid #1E293B`.
- 5 discrete action items:
  1. **Hoje:** Daily log, macro rings, workout adherence.
  2. **Planos:** Training splits and diet breakdown.
  3. **Chat:** AI mentor interface.
  4. **Evolução:** Weight trending, metabolic charts, volume load.
  5. **Perfil:** Metric settings, bio markers, Telegram connector.
- Active item uses `#10B981` icon and label; inactive items use `#64748B`.