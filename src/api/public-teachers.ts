import { RequestFN } from "~/core/request-function";
import { decodePublicTeacher } from "~/decoders/public-teacher";
import { type SessionHandle, type PublicTeacher, EntityKind, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns a list of teachers available for messaging via `ListePublics`.
 */
export const publicTeachers = async (session: SessionHandle): Promise<Array<PublicTeacher>> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "ListePublics", {
    [properties.signature]: { onglet: TabLocation.Discussions },

    [properties.data]: {
      genres: { _T: 26, V: `[${EntityKind.Teacher}]` },
      pourMessagerie: true,
      avecFonctionPersonnel: true,
    }
  });

  const response = await request.send();
  return response.data[properties.data].listePublics.V.map(decodePublicTeacher);
};
