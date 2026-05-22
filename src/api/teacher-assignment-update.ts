import { RequestFN } from "~/core/request-function";
import { encodeServiceBlock, encodeTeacherAssignmentEntry } from "~/encoders/teacher-assignment";
import {
  type ClassOrGroup,
  type Course,
  type Period,
  type SessionHandle,
  type TeacherAssignmentInput,
  TabLocation
} from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Update the metadata (title, date, scale, coefficient, category,
 * boolean flags) of an existing teacher assignment. Issues a `SaisieNotes`
 * request with the existing opaque id and `E: 2`. Pronote returns no body
 * of interest; on success this function resolves to `void`.
 */
export const updateTeacherAssignment = async (
  session: SessionHandle,
  resource: ClassOrGroup,
  period: Period,
  course: Course,
  assignmentId: string,
  input: TeacherAssignmentInput
): Promise<void> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "SaisieNotes", {
    [properties.signature]: { onglet: TabLocation.NotesTeacher },

    [properties.data]: {
      periode: { N: period.id, G: period.kind, L: period.name },
      service: encodeServiceBlock(course),
      listeEleves: [],
      listeDevoirs: [encodeTeacherAssignmentEntry(input, course, period, { kind: "update", assignmentId })],
      listeFichiers: []
    }
  });

  await request.send();
};
