/**
 * A teacher-defined category for assignments (e.g. "Brevet blanc", "TP").
 *
 * Pronote returns the union of categories defined by all teachers of the
 * institution. The `owner` field identifies the creator; `editable` indicates
 * whether the current user can modify it. The "Aucune" sentinel entry has no
 * `id`.
 */
export type EvaluationCategory = Readonly<{
  /** Opaque Pronote id (`N`). Absent for the "Aucune" sentinel entry. */
  id?: string;
  /** Display label (`L`). */
  name: string;
  /** Hex color (`couleur`) if set on the category. */
  color?: string;
  /** Display name of the teacher who created the category (`proprietaire`). */
  owner?: string;
  /** Mirrors `estEditable`. */
  editable: boolean;
}>;
