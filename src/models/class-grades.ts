import type { Period } from "./period";
import type { Student, TeacherAssignment } from "./teacher-assignment";

export type ClassGrades = Readonly<{
  students: Student[];
  /** Assignments sorted by ascending date. */
  assignments: TeacherAssignment[];
  /** Default period advertised by the page (from `listeClasses.V[0].periodeParDefaut`). */
  defaultPeriod?: Period;
}>;
