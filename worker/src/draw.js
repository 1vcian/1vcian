// The pictures: one tile per square and a caption under the board. They are
// SVG served with no caching, so the README shows the game as it is right now.

import { EMPTY, isOver, winLine } from "./logic.js";

const INK = "#0d1020";
const PAPER = "#fff5dc";
const AMBER = "#ffb200";
const RED = "#ff5340";
const BLUE = "#2f6fed";
const NAMES = ["the top left corner", "the top edge", "the top right corner", "the left edge", "the centre", "the right edge", "the bottom left corner", "the bottom edge", "the bottom right corner"];

const cross = `<path d="M30 30 62 62M62 30 30 62" fill="none" stroke-linecap="round"`;
const MARKS = {
  x: `${cross} stroke="${INK}" stroke-width="19"/>${cross} stroke="${RED}" stroke-width="10"/>`,
  o: `<circle cx="46" cy="46" r="18" fill="none" stroke="${INK}" stroke-width="18"/><circle cx="46" cy="46" r="18" fill="none" stroke="${BLUE}" stroke-width="9.5"/>`,
  _: "",
};

/** The picture of square i. */
export function tile(game, i) {
  const cell = game.board[i];
  const line = winLine(game.board);
  const over = isOver(game.board);
  const faded = over && cell === "_";
  const fill = line?.includes(i) ? AMBER : cell === "o" && i === game.last && !over ? "#ffe7a3" : PAPER;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
<g${faded ? ' opacity="0.42"' : ""}>
${faded ? "" : `<rect x="11" y="11" width="84" height="84" rx="17" fill="${AMBER}"/>`}
<rect x="4" y="4" width="84" height="84" rx="17" fill="${fill}" stroke="${INK}" stroke-width="4"/>
${MARKS[cell]}
</g>
</svg>`;
}

/** What to say about the game, and the running score. */
export function captionText(game) {
  let headline;
  if (winLine(game.board)) headline = "Three in a row. I win. Pick a square for a rematch.";
  else if (isOver(game.board)) headline = "A draw. Pick a square to go again.";
  else if (game.board === EMPTY) headline = "Your move. You play X.";
  else headline = `I took ${NAMES[game.last]}. Your move.`;

  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const score = game.played
    ? `${plural(game.played, "game", "games")} so far: I won ${game.won}, ${plural(game.drawn, "draw", "draws")}, you won 0`
    : "No games yet. Be the first to try.";
  return { headline, score };
}

export function caption(game) {
  const { headline, score } = captionText(game);
  const font = `font-family="Helvetica, Arial, sans-serif" text-anchor="middle"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 78" width="520" height="78" role="img" aria-label="${headline} ${score}">
<rect x="7" y="7" width="509" height="67" rx="16" fill="${AMBER}"/>
<rect x="2" y="2" width="509" height="67" rx="16" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>
<text x="256" y="31" fill="${INK}" ${font} font-size="17" font-weight="700">${headline}</text>
<text x="256" y="53" fill="${INK}" ${font} font-size="13" opacity="0.75">${score}</text>
</svg>`;
}
