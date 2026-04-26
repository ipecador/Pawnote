import type { GradeValue } from "./grade-value";

/** A continuous range during which a student was enrolled in a class. */
export type StudentClassRange = Readonly<{
  startDate: Date;
  endDate: Date;
}>;

export type Student = Readonly<{
  /** Opaque Pronote id (`N` field). */
  id: string;
  /** Display label (e.g. "DUPONT Marie"). */
  name: string;
  /**
   * Periods during which the student was enrolled in this class. Pronote
   * exposes parallel `datesDebut[]` / `datesFin[]` arrays nested under
   * `classe.V`; each array index pairs into one `[startDate, endDate]` range.
   */
  classRanges: StudentClassRange[];
}>;

/**
 * A single entry in an assignment's per-student grade list.
 *
 * `value` mirrors Pawnote's `GradeValue` (`{ kind, points }`):
 *   - `kind === GradeKind.Grade`           — actual numeric grade in `points`
 *   - `kind === GradeKind.AbsentZero` (6)  — special code, `points` is 0
 *   - `kind === GradeKind.UnreturnedZero` (7, "Non rendu*") — `points` is 0
 *   - other kinds (Absent / Exempted / NotGraded / Unfit / Unreturned) —
 *     `points` is `NaN`; the cell is "neutral" and excluded from averages
 *
 * `value` is `null` when no entry has been recorded yet for the student
 * (empty cell — distinct from a deliberate special code).
 */
export type StudentGrade = Readonly<{
  studentId: string;
  /** Original `Note.V` string, kept for debugging and future write payloads. */
  raw: string;
  value: GradeValue | null;
}>;

export type TeacherAssignment = Readonly<{
  /** Opaque Pronote id (`N` field). */
  id: string;
  /** Pronote stores the assignment title in the `commentaire` field. */
  title: string;
  date: Date;
  publicationDate: Date;
  /** Numeric value of `bareme.V` (e.g. 20, 25, 10). */
  outOf: number;
  /** Numeric value of `coefficient.V` (e.g. 1, 2, 0.5). */
  coefficient: number;
  /** Mirrors `ramenerSur20`. */
  rescaledTo20: boolean;
  /** Mirrors `commeUnBonus`. */
  asBonus: boolean;
  /** Mirrors `commeUneNote`. */
  asGrade: boolean;
  /** Mirrors `verrouille` — when true, grades cannot be edited. */
  locked: boolean;
  category?: { id: string; name: string; color?: string };
  grades: StudentGrade[];
}>;
