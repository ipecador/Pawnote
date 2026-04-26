import { RequestFN } from "~/core/request-function";
import { decodeClassOrGroup } from "~/decoders/classes-groups";
import { type ClassOrGroup, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns the list of classes and cross-class groups taught by the current
 * teacher (onglet `NotesTeacher`).
 */
export const classesGroups = async (session: SessionHandle): Promise<ClassOrGroup[]> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "listeClassesGroupes", {
    [properties.signature]: { onglet: TabLocation.NotesTeacher },

    [properties.data]: {
      palier: null,
      ressource: null,
      periode: null,
      service: null
    }
  });

  const response = await request.send();
  const list = response.data[properties.data].listeClassesGroupes?.V ?? [];
  return list.map(decodeClassOrGroup);
};
