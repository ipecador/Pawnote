import { RequestFN } from "~/core/request-function";
import { decodeClassGrades } from "~/decoders/class-grades";
import {
  type ClassGrades,
  type ClassOrGroup,
  type Course,
  type Period,
  type SessionHandle,
  TabLocation
} from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns the full class grades page for a (class, period, course) tuple: the
 * class's students, the existing assignments and the per-student grades.
 */
export const classGrades = async (
  session: SessionHandle,
  resource: ClassOrGroup,
  period: Period,
  course: Course
): Promise<ClassGrades> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "PageNotes", {
    [properties.signature]: { onglet: TabLocation.NotesTeacher },

    [properties.data]: {
      ressource: {
        N: resource.id,
        G: resource.kind
      },
      periode: {
        N: period.id,
        G: period.kind,
        L: period.name
      },
      service: {
        N: course.id
      }
    }
  });

  const response = await request.send();
  return decodeClassGrades(response.data[properties.data], session);
};
