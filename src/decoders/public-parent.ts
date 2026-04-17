import { EntityKind, type PublicParent, type PublicParentChild } from "~/models";

const decodeChild = (raw: any): PublicParentChild => ({
  id: raw.N,
  name: raw.L,
  className: raw.classe?.V?.L ?? "",
  groups: (raw.groupes?.V ?? []).map((g: any) => ({
    id: g.N,
    name: g.L,
  })),
});

export const decodePublicParent = (raw: any): PublicParent => ({
  id: raw.N,
  name: raw.L,
  kind: EntityKind.Responsable,
  children: (raw.eleves?.V ?? []).map(decodeChild),
  discussionForbidden: raw.discussionInterdit ?? false,
});
