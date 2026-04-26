import { RequestFN } from "~/core/request-function";
import { decodePeriodList } from "~/decoders/period-list";
import { type ClassOrGroup, type PeriodList, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns the list of periods (Trimestres / Semestres / Mi-Semestres) available
 * for the given class or group, plus the default period as advertised by Pronote.
 */
export const periods = async (session: SessionHandle, resource: ClassOrGroup): Promise<PeriodList> => {
  const properties = apiProperties(session);
  const ressource = {
    N: resource.id,
    G: resource.kind,
    L: resource.name
  };

  const request = new RequestFN(session, "ListePeriodes", {
    [properties.signature]: { onglet: TabLocation.NotesTeacher },

    [properties.data]: {
      palier: null,
      ressource,
      listeRessources: [ressource],
      periode: null,
      service: null
    }
  });

  const response = await request.send();
  return decodePeriodList(response.data[properties.data], session);
};
