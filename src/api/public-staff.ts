import { RequestFN } from "~/core/request-function";
import { decodePublicStaff } from "~/decoders/public-staff";
import { type SessionHandle, type PublicStaff, EntityKind, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns a list of staff members available for messaging via `ListePublics`.
 */
export const publicStaff = async (session: SessionHandle): Promise<Array<PublicStaff>> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "ListePublics", {
    [properties.signature]: { onglet: TabLocation.Discussions },

    [properties.data]: {
      genres: { _T: 26, V: `[${EntityKind.Personal}]` },
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
  return response.data[properties.data].listePublics.V.map(decodePublicStaff);
};
