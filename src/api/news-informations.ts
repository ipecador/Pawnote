import { RequestFN } from "~/core/request-function";
import { decodeNewsCategory } from "~/decoders/news-category";
import { decodeNewsInformation } from "~/decoders/news-information";
import { encodeDomain } from "~/encoders/domain";
import { type NewsCategory, type NewsInformation, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns the list of information messages visible in the user's "Diffusion"
 * view. Matches the Pronote web "Sondages" section (mode G=1), filtered to
 * information items (not surveys).
 */
export const newsInformations = async (session: SessionHandle): Promise<Array<NewsInformation>> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "PageActualites", {
    [properties.signature]: { onglet: TabLocation.News },

    [properties.data]: {
      modesAffActus: {
        _T: 26,
        V: encodeDomain([1])
      }
    }
  });

  const response = await request.send();
  const data = response.data[properties.data];
  const categories: NewsCategory[] = data.listeCategories.V.map(decodeNewsCategory);

  const informations: NewsInformation[] = [];
  for (const mode of data.listeModesAff ?? []) {
    for (const item of mode.listeActualites?.V ?? []) {
      if (!item.estInformation) continue;
      informations.push(decodeNewsInformation(item, session, categories));
    }
  }

  return informations;
};
