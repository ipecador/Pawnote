import type { Course } from "~/models";

const decodeRef = (raw: any): { id: string; name: string } => ({
  id: raw.N,
  name: raw.L
});

const decodeTeacher = (raw: any): { id?: string; name: string } => ({
  id: raw.N,
  name: raw.L
});

export const decodeCourse = (course: any): Course => ({
  id: course.N,
  name: course.L,
  subject: decodeRef(course.matiere.V),
  classRef: decodeRef(course.classe.V),
  groupRef: course.groupe?.V ? decodeRef(course.groupe.V) : undefined,
  teachers: (course.listeProfesseurs?.V ?? []).map(decodeTeacher),
  withoutGrades: course.estSansNote === true,
  subCourses: (course.services?.V ?? []).map(decodeCourse)
});
