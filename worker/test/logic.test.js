import assert from "node:assert/strict";
import test from "node:test";
import { caption, captionText, tile } from "../src/draw.js";
import { EMPTY, STALE_MS, current, free, fresh, isOver, play, put, reply, restart, winLine } from "../src/logic.js";

test("whatever you play, you never win", () => {
  let games = 0;
  const explore = (game) => {
    if (isOver(game.board)) {
      games++;
      const line = winLine(game.board);
      assert.ok(!line || game.board[line[0]] === "o", `you won with ${game.board}`);
      return;
    }
    for (const i of free(game.board)) explore(play(game, i, 1));
  };
  explore(fresh());
  explore(restart(fresh(), 1, true));
  assert.ok(games > 100);
});

test("I take a win when it is there, and block yours", () => {
  assert.equal(reply("oo_xx____"), 2);
  assert.equal(reply("xx_o_____"), 2);
});

test("a move is your x plus my answer, and the score keeps count", () => {
  let game = play(fresh(), 4, 5);
  assert.equal(game.board[4], "x");
  assert.equal([...game.board].filter((cell) => cell === "o").length, 1);
  assert.equal(game.at, 5);
  assert.equal(game.board[game.last], "o");

  assert.equal(play(game, 4, 6), game, "a taken square changes nothing");
  assert.equal(play(game, 9, 6), game);

  while (!isOver(game.board)) game = play(game, free(game.board)[0], 7);
  assert.equal(game.played, 1);
  assert.equal(game.won + game.drawn, 1);

  const again = play(game, 0, 8);
  assert.equal(again.board[0], "x", "a click on a finished board starts the next game there");
  assert.equal([...again.board].filter((cell) => cell !== "_").length, 2);
  assert.equal(again.played, 1);
});

test("an abandoned game is a clean board for the next visitor, with the score kept", () => {
  const game = { ...play(fresh(), 0, 1000), played: 7, won: 5, drawn: 2 };
  assert.equal(current(game, 1000 + STALE_MS - 1), game);
  const later = current(game, 1000 + STALE_MS + 1);
  assert.equal(later.board, EMPTY);
  assert.equal(later.played, 7);
});

test("when I start, I open with one move", () => {
  const game = restart(fresh(), 3, true);
  assert.equal([...game.board].filter((cell) => cell === "o").length, 1);
  assert.equal(game.board[game.last], "o");
});

test("the pictures are well-formed and say the right thing", () => {
  const won = { ...fresh(), board: "ooo_xx_x_", last: 2, played: 1, won: 1 };
  assert.match(captionText(fresh()).headline, /Your move/);
  assert.match(captionText(won).headline, /I win/);
  assert.match(captionText(won).score, /1 game so far: I won 1, 0 draws, you won 0/);
  for (const game of [fresh(), won, play(fresh(), 4, 1)]) {
    for (let i = 0; i < 9; i++) assert.match(tile(game, i), /^<svg[^]*<\/svg>$/);
    assert.match(caption(game), /^<svg[^]*<\/svg>$/);
  }
  assert.ok(tile(won, 0).includes("#ffb200\" stroke"), "the winning squares are amber");
  assert.equal(put(EMPTY, 0, "x"), "x________");
});
