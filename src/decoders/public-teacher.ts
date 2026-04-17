import { EntityKind, type PublicTeacher } from "~/models";

export const decodePublicTeacher = (raw: any): PublicTeacher => ({
  id: raw.N,
  name: raw.L,
  kind: EntityKind.Teacher,
  isPrincipal: raw.estProfPrincipal ?? false,
  isTutor: raw.estProfTuteur ?? false,
  refusesMessages: raw.refusMess ?? false,
});
