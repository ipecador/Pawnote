import { EntityKind, type PublicStudent } from "~/models";

export const decodePublicStudent = (raw: any): PublicStudent => ({
  id: raw.N,
  name: raw.L,
  kind: EntityKind.Student,
  classes: (raw.classes?.V ?? []).map((c: any) => ({
    id: c.N,
    name: c.L,
  })),
  groups: (raw.groupes?.V ?? []).map((g: any) => ({
    id: g.N,
    name: g.L,
  })),
  discussionForbidden: raw.discussionInterdit ?? false,
});
