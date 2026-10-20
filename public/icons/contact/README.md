# Contact icons

Available icons:

- `whatsapp.svg` — original WhatsApp icon from [thesvg.org](https://thesvg.org/icons/whatsapp/default.svg)
- `whatsapp-trb.svg` — the same WhatsApp geometry in TRB Lagoon (`#13788a`)
- `facebook.svg` — original Facebook icon from [thesvg.org](https://thesvg.org/icons/facebook/default.svg)
- `instagram.svg` — original Instagram icon from [thesvg.org](https://thesvg.org/icons/instagram/default.svg)

Use `ContactIcon` from `src/components/ui/contact-icon.tsx` for website UI. It supports `whatsapp`, `facebook`, `instagram`, and the Lucide `mail` icon, as well as accessible labels, decorative use, and configurable size.

Use the original assets when the platform’s native colour is appropriate. Use `variant="trb"` only for WhatsApp when a monochrome TRB treatment is required. To add an icon, store its original SVG here, record its source above, and add its mapping to `ContactIcon`.
