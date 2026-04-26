import { RequestFN } from "~/core/request-function";
import { decodeCourse } from "~/decoders/course";
import {
  type ClassOrGroup,
  type Course,
  type Period,
  type SessionHandle,
  TabLocation
} from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns the courses (subject × class/group) the teacher has access to for
 * the given class and period. For a class where the user is "professeur
 * principal", Pronote returns every course of the class — not only the ones
 * the user teaches.
 *
 * The teacher identity is derived from `session.userResource`; consumers do
 * not pass it explicitly.
 */
export const courses = async (
  session: SessionHandle,
  resource: ClassOrGroup,
  period: Period
): Promise<Course[]> => {
  const properties = apiProperties(session);

  const teacher = session.userResource;

  const request = new RequestFN(session, "ListeServices", {
    [properties.signature]: { onglet: TabLocation.NotesTeacher },

    [properties.data]: {
      Professeur: {
        N: teacher.id,
        G: teacher.kind,
        L: teacher.name
      },
      Ressource: {
        N: resource.id,
        G: resource.kind,
        L: resource.name
      },
      Periode: {
        N: period.id,
        G: period.kind,
        L: period.name
      },
      Eleve: null,
      Pilier: null
    }
  });

  const response = await request.send();
  const list = response.data[properties.data].services?.V ?? [];
  return list.map(decodeCourse);
};
