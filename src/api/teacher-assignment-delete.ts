import { RequestFN } from "~/core/request-function";
import { encodeServiceBlock, encodeTeacherAssignmentEntry } from "~/encoders/teacher-assignment";
import {
  type ClassOrGroup,
  type Course,
  type Period,
  type SessionHandle,
  type TeacherAssignment,
  type TeacherAssignmentInput,
  TabLocation
} from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Delete an existing teacher assignment column. Issues a `SaisieNotes`
 * request with the assignment id, `E: 3`, and the full metadata payload
 * mirrored from the existing `TeacherAssignment` — same shape as the
 * Pronote web client (see `samples/notes/suppresion-devoir.har`).
 *
 * Pronote returns `RapportSaisie: {}` on success; this function resolves
 * to `void`. Note: notes already entered for the deleted column are
 * lost — confirm with the user before calling.
 */
export const deleteTeacherAssignment = async (
  session: SessionHandle,
  resource: ClassOrGroup,
  period: Period,
  course: Course,
  assignment: TeacherAssignment
): Promise<void> => {
  const properties = apiProperties(session);

  // Reconstruct an input from the existing assignment so the encoder can
  // emit the full metadata payload.
  const input: TeacherAssignmentInput = {
    title: assignment.title,
    date: assignment.date,
    publicationDate: assignment.publicationDate,
    outOf: assignment.outOf,
    coefficient: assignment.coefficient,
    categoryId: assignment.category?.id,
    categoryName: assignment.category?.name,
    locked: assignment.locked,
    asBonus: assignment.asBonus,
    asGrade: assignment.asGrade,
    rescaledTo20: assignment.rescaledTo20
  };

  const request = new RequestFN(session, "SaisieNotes", {
    [properties.signature]: { onglet: TabLocation.NotesTeacher },

    [properties.data]: {
      periode: { N: period.id, G: period.kind, L: period.name },
      service: encodeServiceBlock(course),
      listeEleves: [],
      listeDevoirs: [encodeTeacherAssignmentEntry(input, course, period, { kind: "delete", assignmentId: assignment.id })],
      listeFichiers: []
    }
  });

  await request.send();
};
