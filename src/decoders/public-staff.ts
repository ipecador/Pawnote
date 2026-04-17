import { EntityKind, type PublicStaff } from "~/models";

export const decodePublicStaff = (raw: any): PublicStaff => ({
  id: raw.N,
  name: raw.L,
  kind: EntityKind.Personal,
  function: raw.fonction?.V ? { id: raw.fonction.V.N, name: raw.fonction.V.L } : undefined,
  refusesMessages: raw.refusMess ?? false,
});
