import type { GradeKind } from "./grade-kind";

/**
 * A teacher-entered grade value, tagged so the three encodings don't collide:
 *
 *   - `numeric` — a normal grade like `8` or `9.5` (encoded as `"8,00"`)
 *   - `special` — a `GradeKind` code (encoded as `"|<n>"`, e.g. `"|1"` for
 *     Absent). Distinct from numeric because `GradeKind.NotGraded === 3` is
 *     indistinguishable at runtime from a "3 out of 20" grade — the tag
 *     forces explicit intent.
 *   - `empty` — explicit deletion (encoded as `""`). Mirrors Pronote's
 *     `TypeNote.toStr` behaviour when constructed from an empty string
 *     (cf. `samples/professeur.js` line 6964): `genre = note`, value is
 *     NaN, the serialised form is an empty string.
 */
export type TeacherGradeValue =
  | { kind: "numeric"; value: number }
  | { kind: "special"; code: GradeKind }
  | { kind: "empty" };
