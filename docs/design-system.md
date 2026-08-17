# Design system foundation

## Colour

Raw brand colours live in `src/styles/tokens.css` and must not be scattered through components.

| Brand token | Value | Initial role |
| --- | --- | --- |
| `--trb-sand` | `#F0EDDA` | Main background |
| `--trb-walnut` | `#5F4433` | Primary text |
| `--trb-lake` | `#244B74` | Accent and strong sections |
| `--trb-lagoon` | `#13788A` | Reserved secondary brand accent |

Semantic tokens currently map background, surface, text, muted text, accent and border roles onto that palette. Components use semantic tokens so later theme changes do not require component rewrites.

## Typography

Questrial is the display, heading and brand face. Manrope is the body, UI and long-form reading face. Both load centrally through `next/font/google` and expose `--font-display` and `--font-body`. No component imports a font directly.

Heading sizes are fluid at the scaffold level, with balanced wrapping and no fixed heights. Body copy uses readable line spacing and pretty wrapping where supported.

## Spacing and layout

The initial spacing model uses a fluid page gutter, fluid section spacing, a broad content maximum and a narrower reading width. Tailwind owns layout composition while CSS custom properties own durable design decisions. New tokens should represent repeated, approved design-system decisions rather than one-off measurements.

## Responsive and multilingual behaviour

Start with the narrow viewport and enhance for tablet and desktop. Do not tune only for a 1440px canvas. Navigation and section layouts must wrap, and component APIs must accept text of materially different lengths. German, French and Italian should be checked alongside English before a component is considered stable.

## Accessibility

Maintain visible keyboard focus, sufficient contrast, semantic structure and touch-safe interactions. The site includes a translated skip link and a global reduced-motion baseline. Future motion must preserve content and meaning when motion is reduced. No essential interaction may depend only on hover.
