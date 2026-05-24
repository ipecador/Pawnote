import type { TeacherGradeValue } from "~/models";
import { encodePronoteDecimal } from "./pronote-decimal";

/**
 * Encode a teacher-entered grade for the `SaisieNotesUnitaire` payload.
 *
 *   - `{ kind: "numeric", value: 8 }` → `{ _T: 10, V: "8,00" }`
 *   - `{ kind: "special", code: GradeKind.Absent }` → `{ _T: 10, V: "|1" }`
 *   - `{ kind: "empty" }` → `{ _T: 10, V: "" }` (deletion)
 *
 * The `"|<n>"` form is Pronote's sentinel for special codes (1..7); the empty
 * string deletes the cell (confirmed empirically against Pronote).
 */
export const encodeTeacherGrade = (value: TeacherGradeValue): { _T: 10, V: string } => {
  if (value.kind === "numeric") {
    return encodePronoteDecimal(value.value);
  }
  if (value.kind === "special") {
    return { _T: 10, V: `|${value.code}` };
  }
  return { _T: 10, V: "" };
};
