/**
 * Input shape for creating or updating a teacher assignment (gradebook
 * column). Consumers build this from form state and hand it to
 * `createTeacherAssignment` or `updateTeacherAssignment`.
 */
export type TeacherAssignmentInput = Readonly<{
  /** Stored in Pronote's `commentaire` field. */
  title: string;
  date: Date;
  /** Defaults to `date` if absent. */
  publicationDate?: Date;
  /** Maps to `bareme` (e.g. 20, 10, 25). */
  outOf: number;
  coefficient: number;
  /** Opaque Pronote category id. When absent, the `categorie` key is omitted. */
  categoryId?: string;
  /** Category display label. Only used when `categoryId` is set. */
  categoryName?: string;
  /** Maps to `verrouille`. */
  locked: boolean;
  /** Maps to `commeUnBonus`. */
  asBonus: boolean;
  /** Maps to `commeUneNote`. */
  asGrade: boolean;
  /** Maps to `ramenerSur20`. */
  rescaledTo20: boolean;
}>;
