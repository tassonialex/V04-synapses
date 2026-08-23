# Synapses-Lab — Design system

Riferimento visivo: `inspo sito esterno/inspo-sito-esterno.png` (sito Slick).  
Struttura delle pagine: wireframe Figma, non questo file.

Questo documento è la fonte unica per palette, tipo, spacing e componenti. Tutte le pagine successive devono riusarlo, non reintrodurre colori o stili dal file Figma della homepage.

---

## Principi

- **Chiaro / scuro a blocchi**: sezioni full-bleed che alternano nero quasi puro e bianco/lavanda, con molto spazio verticale.
- **Tipografia grande e calma**: titoli display pesanti, corpo regolare, poche dimensioni.
- **Accenti sparati, non decorativi**: verde acido per CTA e highlight; violetto per superfici secondarie e glow.
- **Card morbide**: raggio ampio, bordi sottili, niente ombre pesanti.
- **Tono**: laboratorio applicato, non “agenzia creativa chiassosa”. Il look è premium e tecnico; i testi restano quelli forniti.

---

## Palette

| Token | Hex | Uso |
| --- | --- | --- |
| `--bg-dark` | `#111111` | Header, footer, sezioni scure, hero |
| `--bg-dark-2` | `#18181c` | Card su fondo scuro |
| `--bg-light` | `#ffffff` | Sezioni chiare |
| `--bg-muted` | `#f4f3fb` | Superficie lavanda (CTA, bande) |
| `--text-on-dark` | `#f5f5f7` | Titoli e corpo su scuro |
| `--text-on-light` | `#111111` | Titoli e corpo su chiaro |
| `--text-muted-dark` | `#b8b8c2` | Secondario su scuro |
| `--text-muted-light` | `#5c5c68` | Secondario su chiaro |
| `--accent-green` | `#5cfa7c` | Bottoni primari, highlight numerici, focus glow |
| `--accent-green-ink` | `#06210d` | Testo su bottone verde (contrasto) |
| `--accent-violet` | `#6962f5` | Bottoni secondari, orb hero, hover link |
| `--accent-violet-soft` | `#a09bf9` | Glow, bordi hover |
| `--accent-fuchsia` | `#b23bd6` | Nodi/linee decorativi nei diagrammi SVG (mai testo o fill pieno) |
| `--line-dark` | `rgba(255,255,255,0.12)` | Divider su scuro |
| `--line-light` | `rgba(17,17,17,0.10)` | Divider su chiaro |
| `--grid-line-dark` / `--grid-line-light` | `rgba(245,245,247,0.07)` / `rgba(17,17,17,0.06)` | Texture dot-grid nelle sezioni scure (`.bg-signal-grid`) |
| `--signal-gradient` | viola→fucsia→lime | Hairline di firma sotto l'header |

### V2 — Sistema di segnali (visual system)

Componenti CSS/SVG proprietari introdotti per spezzare i blocchi di solo testo, sempre decorativi e `aria-hidden`:

- `.divider-node` — hairline con nodo centrale, separatore tra sezioni di testo consecutive.
- `.viewfinder` / `.viewfinder--inset` — cornice a mirino (corner-tick) per figure/screenshot, evoca lo strumento di analisi.
- `.bg-signal-grid` — texture a griglia di punti nelle sezioni scure (hero, page-hero).
- `.method-list--process` — diagramma di processo verticale numerato, da usare solo per sequenze reali.
- `.method-list--signals` — griglia di signal-card con nodo "punto di attrito", per elenchi di frizioni/segnali.
- `.partner-network` — diagramma di rete SVG per relazioni reali (es. partner).
- `.heatmap-accent` — wash radiale a bassa opacità (verde/fucsia/viola) per richiamare il tema eye-tracking, nessun dato reale rappresentato.

### Contrast note

- Verde `#5cfa7c` **non** si usa come testo piccolo su bianco. Su chiaro: verde solo come fill di bottone, con testo `--accent-green-ink`.
- Violetto `#6962f5` + testo bianco è per bottoni/pill di dimensione media, non per body copy.

Non usare magenta/lime del wireframe Figma (`#FF00FF`, `#8ECD00`) come colori di sistema.

---

## Tipografia

Font da Google Fonts:

- **Display / UI**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — titoli, nav, bottoni.
- **Corpo**: [Inter](https://fonts.google.com/specimen/Inter) — paragrafi, footer, form futuri.

| Ruolo | Font | Size desktop | Size mobile | Weight | Line-height |
| --- | --- | --- | --- | --- | --- |
| Display (H1) | Plus Jakarta Sans | `clamp(2rem, 4vw, 3rem)` | 2rem | 600 | 1.15 |
| Section (H2) | Plus Jakarta Sans | `clamp(1.5rem, 2.4vw, 2rem)` | 1.5rem | 600–700 | 1.2 |
| Subhead (H3) | Plus Jakarta Sans | 1.125–1.25rem | 1.125rem | 600 | 1.35 |
| Body | Inter | 1.0625–1.125rem | 1rem | 400 | 1.65 |
| Small / meta | Inter | 0.875rem | 0.8125rem | 400–500 | 1.45 |
| Button / nav | Plus Jakarta Sans | 0.9375rem | 0.875rem | 600 | 1 |

Letter-spacing titoli: `-0.02em`. Nav: `0`.

---

## Spacing scale

Base 4px.

| Token | Value | Uso tipico |
| --- | --- | --- |
| `--s-1` | 4px | micro gap |
| `--s-2` | 8px | icon-text |
| `--s-3` | 12px | chip interno |
| `--s-4` | 16px | gap form / nav |
| `--s-5` | 24px | tra titolo e paragrafo |
| `--s-6` | 32px | tra blocchi in card |
| `--s-7` | 48px | tra gruppi |
| `--s-8` | 64px | padding sezione mobile |
| `--s-9` | 96px | padding sezione tablet |
| `--s-10` | 128px | padding sezione desktop |

**Container**: max-width `1120px`, padding orizzontale `24px` (mobile) / `40px` (desktop).  
**Header height**: 72px mobile, 80px desktop.

---

## Radius e bordi

| Token | Value |
| --- | --- |
| `--r-sm` | 8px — chip, input |
| `--r-md` | 12px — bottoni |
| `--r-lg` | 20px — card |
| `--r-xl` | 28px — card hero / diagrammi |
| `--r-full` | 999px — pill |

Bordi: `1px solid var(--line-*)`. Nessuna ombra drop forte; al massimo `0 20px 60px rgba(0,0,0,0.25)` su card elevate.

---

## Componenti

### Header

- Fondo `--bg-dark`, sticky, `backdrop-filter: blur(12px)` se overlay.
- Logo a sinistra (versione bianca su scuro).
- Link testo `--text-on-dark`, hover `--accent-green`.
- CTA a destra: bottone primario (verde).
- Mobile: hamburger a destra, pannello full-screen o drawer con gli stessi link + CTA. `aria-expanded` obbligatorio.

### Bottoni

**Primario** (azione principale: “Richiedi un primo confronto”)

- Background `--accent-green`
- Testo `--accent-green-ink`
- Radius `--r-md` o pill `--r-full`
- Padding `12px 22px` (md) / `14px 28px` (lg)
- Hover: schiarire verso `#7dff96`, `translateY(-1px)`

**Secondario** (es. “Scopri il metodo”)

- Testo `--accent-violet` su chiaro, o bianco su scuro
- Freccia `→` a destra
- Nessun fill; underline on hover

**Ghost su scuro**

- Bordo `--line-dark`, testo bianco, hover bordo `--accent-violet-soft`

### Card

- Radius `--r-lg`
- Padding `--s-6`
- Su scuro: fill `--bg-dark-2` + bordo `--line-dark`
- Su chiaro: fill bianco + bordo `--line-light`
- Titolo H3 + corpo; niente iconografia inventata se manca l’asset

### Link di testo

- Colore ereditato, underline offset 3px on hover.
- Focus visibile: `outline: 2px solid var(--accent-green); outline-offset: 3px`.

### Footer

- Fondo `--bg-dark`
- Griglia 3 colonne desktop (logo | legal/meta | contatti), stack mobile
- Testo `--text-muted-dark`, link hover `--accent-green`
- Non introdurre marquee/ticker dell’inspo se non c’è nel wireframe della pagina

---

## Motion

- Transizioni `150–200ms ease`
- Nessuna animazione di ingresso obbligatoria
- Riduci motion: `prefers-reduced-motion: reduce` → niente translate/hover lift

---

## Breakpoint

| Nome | Width |
| --- | --- |
| Mobile | 375px (min 320) |
| Tablet | 768px |
| Desktop | 1100px+ |

Pattern: 1 colonna → 2 colonne da 768px per hero e sezioni split. Nav hamburger sotto 900px.

---

## Asset logo

| File | Uso |
| --- | --- |
| `img/logo-bianco.png` | Header, footer, superfici scure |
| `img/logo.png` | Superfici chiare (pagine interne future) |

Alt logo: `Synapses-Lab` (il tagline “Algoritmo creativo” è nel file, non in un testo HTML fornito: non duplicarlo come copy di pagina).
