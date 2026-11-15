// The rules and my side of the game. Plain functions, no Worker in sight.
// You are x, I am o. A board is a string of nine characters: "x", "o" or "_".

export const EMPTY = "_________";
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const TASTE = [4, 0, 2, 6, 8, 1, 3, 5, 7]; // centre, then corners, then edges

/** A game nobody has touched for this long starts over for the next visitor. */
export const STALE_MS = 10 * 60 * 1000;

export const free = (board) => [...board].flatMap((cell, i) => (cell === "_" ? [i] : []));
export const put = (board, i, who) => board.slice(0, i) + who + board.slice(i + 1);
export const winLine = (board) => LINES.find(([a, b, c]) => board[a] !== "_" && board[a] === board[b] && board[b] === board[c]) ?? null;
export const isOver = (board) => Boolean(winLine(board)) || !board.includes("_");

// Minimax from my side: positive when I win, and sooner is better.
const memo = new Map();
function value(board, turn) {
  const key = board + turn;
  if (memo.has(key)) return memo.get(key);
  const line = winLine(board);
  const open = free(board);
  let result;
  if (line) result = (board[line[0]] === "o" ? 1 : -1) * (open.length + 1);
  else if (!open.length) result = 0;
  else {
    const next = open.map((i) => value(put(board, i, turn), turn === "o" ? "x" : "o"));
    result = turn === "o" ? Math.max(...next) : Math.min(...next);
  }
  memo.set(key, result);
  return result;
}

/** My move: never a losing one and, among equals, the one that leaves you the most ways to slip. */
export function reply(board) {
  let best = null;
  for (const i of TASTE.filter((cell) => board[cell] === "_")) {
    const after = put(board, i, "o");
    const traps = free(after).filter((j) => value(put(after, j, "x"), "o") > 0).length;
    const score = value(after, "x");
    if (!best || score > best.score || (score === best.score && traps > best.traps)) best = { i, score, traps };
  }
  return best.i;
}

export const fresh = (stats = {}) => ({ board: EMPTY, last: null, at: 0, played: stats.played ?? 0, won: stats.won ?? 0, drawn: stats.drawn ?? 0 });

/** What a visitor should see now: an abandoned game counts as a clean board. */
export function current(game, now) {
  const idle = game.at && now - game.at > STALE_MS;
  return idle && game.board !== EMPTY ? { ...fresh(game), at: 0 } : game;
}

/** A new game. With `iStart` I open. */
export function restart(game, now, iStart = false) {
  const next = { ...fresh(game), at: now };
  if (iStart) {
    next.last = reply(EMPTY);
    next.board = put(EMPTY, next.last, "o");
  }
  return next;
}

/**
 * You take square i, I answer. On a finished board the click starts a new
 * game with that square. A click on a taken square changes nothing.
 */
export function play(game, i, now) {
  if (!Number.isInteger(i) || i < 0 || i > 8) return game;
  let next = isOver(game.board) ? { ...fresh(game) } : { ...game };
  if (next.board[i] !== "_") return game;

  next.board = put(next.board, i, "x");
  next.last = null;
  next.at = now;
  if (!isOver(next.board)) {
    next.last = reply(next.board);
    next.board = put(next.board, next.last, "o");
  }
  if (isOver(next.board)) {
    next.played++;
    if (winLine(next.board)) next.won++;
    else next.drawn++;
  }
  return next;
}
