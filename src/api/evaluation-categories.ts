import { RequestFN } from "~/core/request-function";
import { decodeEvaluationCategory } from "~/decoders/evaluation-category";
import { type EvaluationCategory, type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Returns the list of evaluation categories available to the current
 * teacher (onglet `NotesTeacher`). The list spans every category created
 * by any teacher of the institution; non-editable entries (incl. the
 * "Aucune" sentinel) are returned with `editable: false`.
 */
export const evaluationCategories = async (session: SessionHandle): Promise<EvaluationCategory[]> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "CategorieEvaluation", {
    [properties.signature]: { onglet: TabLocation.NotesTeacher }
  });

  const response = await request.send();
  const list = response.data[properties.data]?.listeCategories?.V ?? [];
  return list.map(decodeEvaluationCategory);
};
