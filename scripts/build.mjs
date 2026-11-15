// Draws the link buttons under the banner: `node scripts/build.mjs`.

import { mkdirSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const write = (path, text) => writeFileSync(new URL(path, root), text);

const INK = "#0d1020";
const PAPER = "#fff5dc";
const AMBER = "#ffb200";

// ── link buttons ───────────────────────────────────────────────────────────
// Helvetica and Arial share their metrics, so the measured label widths hold
// on every system; textLength pins them anyway.

const ICONS = {
  globe: `<g fill="none" stroke="${INK}" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></g>`,
  linkedin: `<path fill="${INK}" transform="translate(2.4 1) scale(0.043)" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>`,
  mail: `<g fill="none" stroke="${INK}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></g>`,
  download: `<path fill="none" stroke="${INK}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M12 4v11M7 11l5 5 5-5M5 20h14"/>`,
  terminal: `<path fill="none" stroke="${INK}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" d="m4 7 5 5-5 5M12.5 18H20"/>`,
};

const BUTTONS = [
  { file: "site", icon: "globe", label: "1vcian.me", width: 72.5 },
  { file: "linkedin", icon: "linkedin", label: "LinkedIn", width: 61.7 },
  { file: "email", icon: "mail", label: "Email", width: 40 },
  { file: "resume", icon: "download", label: "Résumé", width: 58.4 },
  { file: "card", icon: "terminal", label: "npx 1vcian", width: 84, mono: true },
];

function button({ icon, label, width, mono }) {
  const body = 16 + 19 + 9 + width + 18;
  const font = mono ? `font-family="Menlo, Consolas, 'Liberation Mono', monospace" font-size="14" font-weight="700"` : `font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="700"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${body + 8} 46" width="${body + 8}" height="46" role="img" aria-label="${label}">
<rect x="6" y="6" width="${body}" height="38" rx="19" fill="${AMBER}"/>
<rect x="2" y="2" width="${body}" height="38" rx="19" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>
<g transform="translate(17 11.5) scale(0.79)">${ICONS[icon]}</g>
<text x="${2 + 16 + 19 + 9}" y="26.2" fill="${INK}" ${font} textLength="${width}" lengthAdjust="spacingAndGlyphs">${label}</text>
</svg>
`;
}

mkdirSync(new URL("assets/buttons", root), { recursive: true });
for (const b of BUTTONS) write(`assets/buttons/${b.file}.svg`, button(b));
console.log(`${BUTTONS.length} buttons drawn`);
