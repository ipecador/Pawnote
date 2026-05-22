/**
 * Extract the opaque id of a newly-created teacher assignment from a
 * `SaisieNotes` response. Pronote returns the new id at
 * `dataSec.RapportSaisie.listeDevoirsCrees.V[0].N`.
 */
export const extractCreatedAssignmentId = (rawResponse: any): string => {
  const created = rawResponse?.RapportSaisie?.listeDevoirsCrees?.V;
  if (!Array.isArray(created) || created.length === 0 || typeof created[0]?.N !== "string") {
    throw new Error("SaisieNotes response did not include a created assignment id");
  }
  return created[0].N;
};
