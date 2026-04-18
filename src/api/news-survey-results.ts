import { RequestFN } from "~/core/request-function";
import { decodeNewsSurveyResults } from "~/decoders/news-survey-result";
import { type NewsSurveyQuestionResult, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns the detailed results for a given survey.
 *
 * @param session - The current session handle.
 * @param surveyId - The ID of the survey (`N` field).
 * @param surveyTitle - The title of the survey (`L` field).
 */
export const newsSurveyResults = async (
  session: SessionHandle,
  surveyId: string,
  surveyTitle: string,
): Promise<Array<NewsSurveyQuestionResult>> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "PageActualitesResultats", {
    [properties.signature]: { onglet: TabLocation.News },

    [properties.data]: {
      actualite: {
        N: surveyId,
        L: surveyTitle,
      },
      avecCumulClasses: true,
    }
  });

  const response = await request.send();
  return decodeNewsSurveyResults(response.data[properties.data]);
};
