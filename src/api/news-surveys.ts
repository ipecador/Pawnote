import { RequestFN } from "~/core/request-function";
import { decodeNewsCategory } from "~/decoders/news-category";
import { decodeNewsSurvey } from "~/decoders/news-survey";
import { encodeDomain } from "~/encoders/domain";
import { type NewsCategory, type NewsSurvey, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns the list of surveys visible in the user's "Sondages" tab.
 * Matches the Pronote web "Sondages" section (mode G=1).
 */
export const newsSurveys = async (session: SessionHandle): Promise<Array<NewsSurvey>> => {
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

  const surveys: NewsSurvey[] = [];
  for (const mode of data.listeModesAff ?? []) {
    for (const item of mode.listeActualites?.V ?? []) {
      if (!item.estSondage) continue;
      surveys.push(decodeNewsSurvey(item, session, categories));
    }
  }

  return surveys;
};
