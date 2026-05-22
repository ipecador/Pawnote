import type { Course, Period, TeacherAssignmentInput } from "~/models";
import { encodePronoteDay } from "./pronote-day";
import { encodePronoteDecimal } from "./pronote-decimal";

/**
 * Discriminated union signalling whether a `SaisieNotes` payload entry
 * is creating, updating or deleting an assignment column.
 */
export type EncodeTeacherAssignmentMode =
  | { kind: "create" }
  | { kind: "update"; assignmentId: string }
  | { kind: "delete"; assignmentId: string };

/**
 * Build the single entry of `listeDevoirs[]` in a `SaisieNotes` payload.
 *
 * Pronote distinguishes the three operations by the `N` and `E` fields:
 *   - create → `N: -1`, `E: 1`
 *   - update → `N: "<id>"`, `E: 2`
 *   - delete → `N: "<id>"`, `E: 3` (full metadata payload, as observed in
 *     `samples/notes/suppresion-devoir.har`)
 *
 * `commentaire` carries the assignment title (Pronote convention).
 * When `input.categoryId` is undefined the `categorie` key is omitted.
 * The `ListeThemes: []` field is sent for both update and delete (the
 * captured create payload doesn't include it, but Pronote tolerates an
 * empty array consistently — keeps all three code paths uniform).
 */
export const encodeTeacherAssignmentEntry = (
  input: TeacherAssignmentInput,
  course: Course,
  period: Period,
  mode: EncodeTeacherAssignmentMode
): any => {
  const N = mode.kind === "create" ? -1 : mode.assignmentId;
  const E = mode.kind === "create" ? 1 : mode.kind === "update" ? 2 : 3;
  const entry: any = {
    N,
    E,
    date: encodePronoteDay(input.date),
    coefficient: encodePronoteDecimal(input.coefficient),
    verrouille: input.locked,
    commeUnBonus: input.asBonus,
    commeUneNote: input.asGrade,
    commentaire: input.title,
    bareme: encodePronoteDecimal(input.outOf),
    ramenerSur20: input.rescaledTo20,
    datePublication: encodePronoteDay(input.publicationDate ?? input.date),
    avecCommentaireSurNoteEleve: false,
    ListeThemes: [],
    listeSujets: [],
    listeCorriges: [],
    listeClasses: [buildListeClassesEntry(course, period)],
    listeEleves: []
  };

  if (input.categoryId !== undefined && input.categoryName !== undefined) {
    entry.categorie = { N: input.categoryId, L: input.categoryName };
  }

  return entry;
};

const buildListeClassesEntry = (course: Course, period: Period): any => ({
  N: course.classRef.id,
  L: course.classRef.name,
  service: { N: course.id, L: course.name },
  periodePrincipale: { N: period.id, L: period.name },
  periodeSecondaire: { N: 0 }
});

/**
 * Build the top-level `service` block of a `SaisieNotes` payload.
 *
 * Two fields come from the course when available (`coefficientGeneral`,
 * `facultatif` — populated from `PageNotes`). The remaining evaluation
 * parameters are hardcoded to defaults that match a standard teacher
 * configuration as observed in the reference HAR. This is a documented
 * V1 limitation; if a non-standard config is rejected by Pronote, the
 * source of these fields will need to be investigated.
 */
export const encodeServiceBlock = (course: Course): any => ({
  N: course.id,
  L: course.name,
  coefficientGeneral: encodePronoteDecimal(course.coefficientGeneral ?? 1),
  facultatif: course.facultatif ?? false,
  moyenneParSousMatiere: false,
  moyenneBulletinSurClasse: false,
  avecDevoirSupMoy: false,
  avecBonusMalus: false,
  ponderationNotePlusHaute: encodePronoteDecimal(1),
  ponderationNotePlusBasse: encodePronoteDecimal(1),
  arrondiEleve: { _T: 14, V: 7 },
  arrondiClasse: { _T: 14, V: 0 }
});
