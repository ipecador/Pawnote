import type { EntityKind } from "./entity-kind";

export type PublicStaff = Readonly<{
  id: string;
  name: string;
  kind: typeof EntityKind.Personal;
  function?: Readonly<{ id: string; name: string }>;
  refusesMessages: boolean;
}>;
