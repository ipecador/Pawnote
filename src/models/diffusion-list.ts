import type { EntityKind } from "./entity-kind";

export type DiffusionListMember = Readonly<{
  id: string;
  name: string;
  kind: typeof EntityKind.Teacher | typeof EntityKind.Personal;
}>;

export type DiffusionList = Readonly<{
  id: string;
  name: string;
  isPublic: boolean;
  isAuthor: boolean;
  authorLabel: string;
  members: Array<DiffusionListMember>;
}>;
