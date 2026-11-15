// Builds everything in this profile that is generated: `node scripts/build.mjs`.
//
//   assets/buttons/*.svg   the link buttons under the banner
//   assets/ttt/*.svg       the tiles of the tic-tac-toe board
//   play/*.md              one page for every position a visitor can reach
//   readme.md              only the board between the two "game" markers
//
// How the game works without a server: a README cannot run code, but it can
// link. Every empty square is a link to the page that shows the board after
// your move and my answer. Tic-tac-toe is small enough to work out all of it
// in advance, so that is what this script does.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const write = (path, text) => writeFileSync(new URL(path, root), text);

const INK = "#0d1020";
const PAPER = "#fff5dc";
const AMBER = "#ffb200";
const RED = "#ff5340";
const BLUE = "#2f6fed";

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

// ── tic-tac-toe: the tiles ─────────────────────────────────────────────────

const cross = `<path d="M30 30 62 62M62 30 30 62" fill="none" stroke-linecap="round"`;
const marks = {
  x: `${cross} stroke="${INK}" stroke-width="19"/>${cross} stroke="${RED}" stroke-width="10"/>`,
  o: `<circle cx="46" cy="46" r="18" fill="none" stroke="${INK}" stroke-width="18"/><circle cx="46" cy="46" r="18" fill="none" stroke="${BLUE}" stroke-width="9.5"/>`,
};

function tile({ mark, fill = PAPER, faded = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
<g${faded ? ' opacity="0.42"' : ""}>
${faded ? "" : `<rect x="11" y="11" width="84" height="84" rx="17" fill="${AMBER}"/>\n`}<rect x="4" y="4" width="84" height="84" rx="17" fill="${fill}" stroke="${INK}" stroke-width="4"/>
${mark ? marks[mark] : ""}
</g>
</svg>
`;
}

const TILES = {
  free: tile({}), // empty, and yours to take
  off: tile({ faded: true }), // empty, but the game is over
  x: tile({ mark: "x" }),
  o: tile({ mark: "o" }),
  "o-new": tile({ mark: "o", fill: "#ffe7a3" }), // the square I just took
  "o-win": tile({ mark: "o", fill: AMBER }), // part of my three in a row
};

// ── tic-tac-toe: the brain ─────────────────────────────────────────────────
// You are x, I am o. A board is an array of nine: "x", "o" or "_".

const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const NAMES = ["the top left corner", "the top edge", "the top right corner", "the left edge", "the centre", "the right edge", "the bottom left corner", "the bottom edge", "the bottom right corner"];
const SPOTS = ["top left", "top", "top right", "left", "centre", "right", "bottom left", "bottom", "bottom right"];
const TASTE = [4, 0, 2, 6, 8, 1, 3, 5, 7]; // centre, then corners, then edges

const empty = (board) => board.flatMap((cell, i) => (cell === "_" ? [i] : []));
const put = (board, i, who) => board.map((cell, j) => (j === i ? who : cell));
const winLine = (board) => LINES.find(([a, b, c]) => board[a] !== "_" && board[a] === board[b] && board[b] === board[c]);

// Minimax, from my side: positive when I win, sooner is better.
const memo = new Map();
function value(board, turn) {
  const key = board.join("") + turn;
  if (memo.has(key)) return memo.get(key);
  const line = winLine(board);
  const free = empty(board);
  let result;
  if (line) result = (board[line[0]] === "o" ? 1 : -1) * (free.length + 1);
  else if (!free.length) result = 0;
  else {
    const next = free.map((i) => value(put(board, i, turn), turn === "o" ? "x" : "o"));
    result = turn === "o" ? Math.max(...next) : Math.min(...next);
  }
  memo.set(key, result);
  return result;
}

/** My move: never a losing one and, among equals, the one with the most ways for you to slip. */
function answer(board) {
  let best = null;
  for (const i of TASTE.filter((i) => board[i] === "_")) {
    const after = put(board, i, "o");
    const traps = empty(after).filter((j) => value(put(after, j, "x"), "o") > 0).length;
    const score = [value(after, "x"), traps];
    if (!best || score[0] > best.score[0] || (score[0] === best.score[0] && score[1] > best.score[1])) best = { i, score };
  }
  return best.i;
}

// ── tic-tac-toe: every page ────────────────────────────────────────────────

const HEADING = "Beat me at tic-tac-toe";
const PROFILE = `https://github.com/1vcian#${HEADING.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/ /g, "-")}`;
const SIZE = 88;

const idOf = (board, last) => `${board.join("")}-${last ?? "n"}`;
const pages = new Map(); // id → { board, last }

/** The page a click on square i leads to: your x, then my answer if the game goes on. */
function after(board, i) {
  let next = put(board, i, "x");
  let last = null;
  if (!winLine(next) && empty(next).length) {
    last = answer(next);
    next = put(next, last, "o");
  }
  return { board: next, last };
}

function visit(board, last) {
  const id = idOf(board, last);
  if (pages.has(id)) return id;
  pages.set(id, { board, last });
  if (!winLine(board)) for (const i of empty(board)) visit(...Object.values(after(board, i)));
  return id;
}

const blank = Array(9).fill("_");
visit(blank, null);
const iStart = answer(blank);
const iStartId = visit(put(blank, iStart, "o"), iStart);

/** The nine tiles. `here` is the page the board sits on, `to` turns a page id into a link. */
function boardHtml({ board, last }, { tiles, to, here }) {
  const line = winLine(board);
  const over = Boolean(line) || !empty(board).length;
  const rows = [0, 3, 6].map((start) =>
    [0, 1, 2]
      .map((offset) => {
        const i = start + offset;
        const cell = board[i];
        const img = (name, alt) => `<img src="${tiles}/${name}.svg" width="${SIZE}" height="${SIZE}" alt="${alt}">`;
        if (cell === "_" && !over) {
          const next = after(board, i);
          return `<a href="${to(idOf(next.board, next.last))}" title="Play ${SPOTS[i]}">${img("free", `empty square, ${SPOTS[i]}: play here`)}</a>`;
        }
        const name = cell === "_" ? "off" : cell === "x" ? "x" : line?.includes(i) ? "o-win" : i === last && !over ? "o-new" : "o";
        const alt = cell === "_" ? `empty square, ${SPOTS[i]}` : `${cell === "x" ? "your X" : "my O"}, ${SPOTS[i]}`;
        // Without a link GitHub wraps the picture in one that opens the image; this one just stays here.
        return here ? `<a href="${here}">${img(name, alt)}</a>` : img(name, alt);
      })
      .join(" ")
  );
  return `<p>\n${rows.join("<br>\n")}\n</p>`;
}

function pageMarkdown(id, state) {
  const { board, last } = state;
  const line = winLine(board);
  const draw = !line && !empty(board).length;
  const opening = empty(board).length === 9;

  let title;
  let note;
  if (line) {
    title = "Three in a row. I win.";
    note = "Don't take it badly: nobody has beaten me yet.";
  } else if (draw) {
    title = "A draw.";
    note = "That is as good as it gets here. For a game you can actually win, run <code>npx 1vcian</code> and look for the hidden one.";
  } else {
    title = "Your move";
    note = opening ? "You play X: pick a square." : `I took ${NAMES[last]}. Your turn.`;
  }

  const links = [
    opening ? null : `<a href="new.md">New game</a>`,
    id === iStartId ? null : `<a href="${iStartId}.md">${line || draw ? "This time I start" : "Let me start instead"}</a>`,
    `<a href="${PROFILE}">Back to my profile</a>`,
  ].filter(Boolean);

  return `<div align="center">

<h3>${title}</h3>

${boardHtml(state, { tiles: "../assets/ttt", to: (next) => `${next}.md`, here: `${id === idOf(blank, null) ? "new" : id}.md` })}

<p>${note}</p>

<p>${links.join(" &nbsp;·&nbsp; ")}</p>

</div>
`;
}

// ── write it all ───────────────────────────────────────────────────────────

for (const dir of ["assets/buttons", "assets/ttt", "play"]) {
  rmSync(new URL(dir, root), { recursive: true, force: true });
  mkdirSync(new URL(dir, root), { recursive: true });
}
for (const b of BUTTONS) write(`assets/buttons/${b.file}.svg`, button(b));
for (const [name, svg] of Object.entries(TILES)) write(`assets/ttt/${name}.svg`, svg);

const blankId = idOf(blank, null);
for (const [id, state] of pages) write(`play/${id === blankId ? "new" : id}.md`, pageMarkdown(id, state));

// the opening board inside the README
const readmePath = new URL("readme.md", root);
const readme = readFileSync(readmePath, "utf8");
const START = "<!-- game:start (generated by scripts/build.mjs) -->";
const END = "<!-- game:end -->";
if (!readme.includes(START) || !readme.includes(END)) throw new Error("readme.md is missing the game markers");
const board = boardHtml(pages.get(blankId), { tiles: "assets/ttt", to: (next) => `play/${next}.md` });
const text = `<p>You play X: pick a square. Rather I start? <a href="play/${iStartId}.md">Go on then.</a></p>`;
writeFileSync(readmePath, `${readme.slice(0, readme.indexOf(START) + START.length)}\n${board}\n\n${text}\n${readme.slice(readme.indexOf(END))}`);

// ── check it ───────────────────────────────────────────────────────────────

let wins = 0;
let draws = 0;
for (const [id, { board: b }] of pages) {
  const line = winLine(b);
  if (line && b[line[0]] === "x") throw new Error(`you can win at ${id}: that is a bug`);
  if (line) wins++;
  else if (!empty(b).length) draws++;
  else for (const i of empty(b)) if (!pages.has(idOf(...Object.values(after(b, i))))) throw new Error(`dead link from ${id}`);
}
console.log(`${pages.size} pages: ${wins} end with my three in a row, ${draws} in a draw, none with yours`);
