import type { Student, StudentClassRange, StudentGrade, TeacherAssignment } from "~/models";
import { decodeGradeValue } from "./grade-value";
import { decodePronoteDate } from "./pronote-date";

const decodeStudentGrade = (studentGrade: any): StudentGrade => {
  const studentId: string = studentGrade.N;
  const noteRaw: string = studentGrade.Note?.V ?? "";

  if (noteRaw === "") {
    return { studentId, raw: noteRaw, value: null };
  }

  return {
    studentId,
    raw: noteRaw,
    value: decodeGradeValue(noteRaw)
  };
};

const decodeClassRanges = (classe: any): StudentClassRange[] => {
  const starts: any[] = classe?.datesDebut ?? [];
  const ends: any[] = classe?.datesFin ?? [];
  const n = Math.min(starts.length, ends.length);
  const ranges: StudentClassRange[] = [];
  for (let i = 0; i < n; i++) {
    const startValue = starts[i]?.V;
    const endValue = ends[i]?.V;
    if (typeof startValue === "string" && typeof endValue === "string") {
      ranges.push({
        startDate: decodePronoteDate(startValue),
        endDate: decodePronoteDate(endValue)
      });
    }
  }
  return ranges;
};

export const decodeStudent = (student: any): Student => ({
  id: student.N,
  name: student.L,
  classRanges: decodeClassRanges(student.classe?.V)
});

const decodeCategory = (category: any): { id: string; name: string; color?: string } => ({
  id: category.N,
  name: category.L,
  color: category.couleur
});

export const decodeTeacherAssignment = (teacherAssignment: any): TeacherAssignment => ({
  id: teacherAssignment.N,
  title: teacherAssignment.commentaire ?? "",
  date: decodePronoteDate(teacherAssignment.date.V),
  publicationDate: decodePronoteDate(teacherAssignment.datePublication.V),
  outOf: parseFloat(teacherAssignment.bareme.V),
  coefficient: parseFloat(teacherAssignment.coefficient.V),
  rescaledTo20: teacherAssignment.ramenerSur20 === true,
  asBonus: teacherAssignment.commeUnBonus === true,
  asGrade: teacherAssignment.commeUneNote === true,
  locked: teacherAssignment.verrouille === true,
  category: teacherAssignment.categorie?.V ? decodeCategory(teacherAssignment.categorie.V) : undefined,
  grades: (teacherAssignment.listeEleves?.V ?? []).map(decodeStudentGrade)
});
