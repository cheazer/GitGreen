// 3x5 pixel font. Each letter = 5 strings of 3 chars, same stencil language
// as pattern.js (X = dark square, . = empty). Data, not logic.

const FONT = {
  A: [".X.", "X.X", "XXX", "X.X", "X.X"],
  B: ["XX.", "X.X", "XX.", "X.X", "XX."],
  C: [".XX", "X..", "X..", "X..", ".XX"],
  D: ["XX.", "X.X", "X.X", "X.X", "XX."],
  E: ["XXX", "X..", "XX.", "X..", "XXX"],
  F: ["XXX", "X..", "XX.", "X..", "X.."],
  G: [".XX", "X..", "X.X", "X.X", ".XX"],
  H: ["X.X", "X.X", "XXX", "X.X", "X.X"],
  I: ["XXX", ".X.", ".X.", ".X.", "XXX"],
  J: ["..X", "..X", "..X", "X.X", ".X."],
  K: ["X.X", "X.X", "XX.", "X.X", "X.X"],
  L: ["X..", "X..", "X..", "X..", "XXX"],
  M: ["X.X", "XXX", "X.X", "X.X", "X.X"],
  N: ["X.X", "XXX", "XXX", "X.X", "X.X"],
  O: [".X.", "X.X", "X.X", "X.X", ".X."],
  P: ["XX.", "X.X", "XX.", "X..", "X.."],
  Q: [".X.", "X.X", "X.X", "XX.", ".XX"],
  R: ["XX.", "X.X", "XX.", "X.X", "X.X"],
  S: [".XX", "X..", ".X.", "..X", "XX."],
  T: ["XXX", ".X.", ".X.", ".X.", ".X."],
  U: ["X.X", "X.X", "X.X", "X.X", "XXX"],
  V: ["X.X", "X.X", "X.X", "X.X", ".X."],
  W: ["X.X", "X.X", "X.X", "XXX", "X.X"],
  X: ["X.X", "X.X", ".X.", "X.X", "X.X"],
  Y: ["X.X", "X.X", ".X.", ".X.", ".X."],
  Z: ["XXX", "..X", ".X.", "X..", "XXX"],
  " ": ["...", "...", "...", "...", "..."],
};

/** Convert text into a 7-row stencil string, vertically centered. */
export function textToStencil(text) {
  const letters = [...text.toUpperCase()].map((ch) => {
    if (!FONT[ch]) throw new Error(`no glyph for "${ch}" — letters and spaces only`);
    return FONT[ch];
  });

  // Glue letters side by side with a 1-column gap, row by row.
  const rows = Array.from({ length: 5 }, (_, r) =>
    letters.map((glyph) => glyph[r]).join(".")
  );

  const width = rows[0].length;
  const blank = ".".repeat(width);
  return [blank, ...rows, blank].join("\n"); // pad top+bottom -> 7 rows, centered
}