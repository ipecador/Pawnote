import { RequestFN } from "~/core/request-function";
import { encodeTeacherGrade } from "~/encoders/teacher-grade";
import { type SessionHandle, TabLocation, type TeacherGradeValue } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Save a single teacher-entered grade for one student × one assignment.
 *
 * Issues a `SaisieNotesUnitaire` request on the `NotesTeacher` tab. Pronote
 * returns `RapportSaisie: {}` on success; the function resolves to `void`.
 *
 * This endpoint operates on **one cell at a time**. Callers wishing to save
 * multiple cells SHALL invoke `saveTeacherGrade` sequentially — the project
 * rule "no parallel Pronote calls" applies (a session counter desyncs
 * under concurrent requests).
 */
export const saveTeacherGrade = async (
  session: SessionHandle,
  assignmentId: string,
  student: { id: string; name: string },
  value: TeacherGradeValue
): Promise<void> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "SaisieNotesUnitaire", {
    [properties.signature]: { onglet: TabLocation.NotesTeacher },

    [properties.data]: {
      listeDevoirs: [{
        N: assignmentId,
        listeEleves: [{
          N: student.id,
          L: student.name,
          note: encodeTeacherGrade(value)
        }]
      }]
    }
  });

  await request.send();
};
