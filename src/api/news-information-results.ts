import { RequestFN } from "~/core/request-function";
import { decodeNewsSurveyResults } from "~/decoders/news-survey-result";
import { type NewsSurveyQuestionResult, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns the acknowledgment results for a given information message.
 * Uses the same `PageActualitesResultats` endpoint as surveys; the payload
 * shape matches, and an information has a single "question" representing
 * the acknowledgment status of each recipient.
 */
export const newsInformationResults = async (
  session: SessionHandle,
  informationId: string,
  informationTitle: string,
): Promise<Array<NewsSurveyQuestionResult>> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "PageActualitesResultats", {
    [properties.signature]: { onglet: TabLocation.News },

    [properties.data]: {
      actualite: {
        N: informationId,
        L: informationTitle,
      },
      avecCumulClasses: true,
    }
  });

  const response = await request.send();
  return decodeNewsSurveyResults(response.data[properties.data]);
};
