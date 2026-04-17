import { RequestFN } from "~/core/request-function";
import { decodeDiffusionList } from "~/decoders/diffusion-list";
import { type SessionHandle, type DiffusionList, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns the list of diffusion lists (named contact groups) for messaging.
 */
export const diffusionLists = async (session: SessionHandle): Promise<Array<DiffusionList>> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "ListeDiffusion", {
    [properties.signature]: { onglet: TabLocation.Discussions },

    [properties.data]: {}
  });

  const response = await request.send();
  return (response.data[properties.data].liste?.V ?? []).map(decodeDiffusionList);
};
