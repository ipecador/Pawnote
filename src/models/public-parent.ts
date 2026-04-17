import type { EntityKind } from "./entity-kind";

export type PublicParentChild = Readonly<{
  id: string;
  name: string;
  className: string;
  groups: Array<Readonly<{ id: string; name: string }>>;
}>;

export type PublicParent = Readonly<{
  id: string;
  name: string;
  kind: typeof EntityKind.Responsable;
  children: Array<PublicParentChild>;
  discussionForbidden: boolean;
}>;
