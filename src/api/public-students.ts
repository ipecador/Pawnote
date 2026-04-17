import { RequestFN } from "~/core/request-function";
import { decodePublicStudent } from "~/decoders/public-student";
import { type SessionHandle, type PublicStudent, EntityKind, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns a list of students available for messaging via `ListePublics`.
 */
export const publicStudents = async (session: SessionHandle): Promise<Array<PublicStudent>> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "ListePublics", {
    [properties.signature]: { onglet: TabLocation.Discussions },

    [properties.data]: {
      genres: { _T: 26, V: `[${EntityKind.Student}]` },
      pourMessagerie: true,
      sansFiltreSurEleve: true,
      avecFonctionPersonnel: true,
      avecInfoRencontresSepareesDesResponsables: false,
      avecInfoResponsablePreferentiel: false,
      avecUniquementResponsableDelegue: false,
      estCtxModeleActualite: false,
    }
  });

  const response = await request.send();
  return response.data[properties.data].listePublics.V.map(decodePublicStudent);
};
