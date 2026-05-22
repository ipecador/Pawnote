import { RequestFN } from "~/core/request-function";
import { extractCreatedAssignmentId } from "~/decoders/saisie-notes-response";
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
 * Create a new teacher assignment (gradebook column) for the given course
 * and period. Issues a `SaisieNotes` request with a single negative-id
 * entry in `listeDevoirs`; Pronote returns the freshly-assigned opaque id
 * in the `RapportSaisie.listeDevoirsCrees` array, which this function
 * extracts and returns.
 */
export const createTeacherAssignment = async (
  session: SessionHandle,
  resource: ClassOrGroup,
  period: Period,
  course: Course,
  input: TeacherAssignmentInput
): Promise<string> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "SaisieNotes", {
    [properties.signature]: { onglet: TabLocation.NotesTeacher },

    [properties.data]: {
      periode: { N: period.id, G: period.kind, L: period.name },
      service: encodeServiceBlock(course),
      listeEleves: [],
      listeDevoirs: [encodeTeacherAssignmentEntry(input, course, period, { kind: "create" })],
      listeFichiers: []
    }
  });

  const response = await request.send();
  return extractCreatedAssignmentId(response.data);
};
