import { RequestFN } from "~/core/request-function";
import { decodePublicParent } from "~/decoders/public-parent";
import { type SessionHandle, type PublicParent, EntityKind, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns a list of parents available for messaging via `ListePublics`.
 */
export const publicParents = async (session: SessionHandle): Promise<Array<PublicParent>> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "ListePublics", {
    [properties.signature]: { onglet: TabLocation.Discussions },

    [properties.data]: {
      genres: { _T: 26, V: `[${EntityKind.Responsable}]` },
      pourMessagerie: true,
      avecFonctionPersonnel: true,
    }
  });

  const response = await request.send();
  return response.data[properties.data].listePublics.V.map(decodePublicParent);
};
