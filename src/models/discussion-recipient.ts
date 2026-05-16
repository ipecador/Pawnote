import type { EntityKind } from "./entity-kind";

export type DiscussionRecipient = Readonly<{
  id: string
  name: string;
  kind: EntityKind;
  disallowMessages: boolean;
}>;
