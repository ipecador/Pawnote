import type { EvaluationCategory } from "~/models";

/**
 * Decode one raw entry of `CategorieEvaluation.dataSec.data.listeCategories.V`
 * into an `EvaluationCategory`. The "Aucune" sentinel entry (no `N`) is
 * decoded with `id` undefined.
 */
export const decodeEvaluationCategory = (raw: any): EvaluationCategory => ({
  id: typeof raw.N === "string" ? raw.N : undefined,
  name: raw.L,
  color: typeof raw.couleur === "string" ? raw.couleur : undefined,
  owner: typeof raw.proprietaire === "string" ? raw.proprietaire : undefined,
  editable: raw.estEditable === true
});
