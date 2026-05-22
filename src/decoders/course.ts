import type { Course } from "~/models";

const decodeRef = (raw: any): { id: string; name: string } => ({
  id: raw.N,
  name: raw.L
});

const decodeTeacher = (raw: any): { id?: string; name: string } => ({
  id: raw.N,
  name: raw.L
});

const decodePronoteDecimal = (raw: unknown): number | undefined => {
  if (typeof raw !== "string") return undefined;
  const parsed = parseFloat(raw.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const decodeCourse = (course: any): Course => ({
  id: course.N,
  name: course.L,
  subject: decodeRef(course.matiere.V),
  classRef: decodeRef(course.classe.V),
  groupRef: course.groupe?.V ? decodeRef(course.groupe.V) : undefined,
  teachers: (course.listeProfesseurs?.V ?? []).map(decodeTeacher),
  withoutGrades: course.estSansNote === true,
  subCourses: (course.services?.V ?? []).map(decodeCourse),
  coefficientGeneral: decodePronoteDecimal(course.coefficientGeneral?.V),
  facultatif: typeof course.facultatif === "boolean" ? course.facultatif : undefined
});
