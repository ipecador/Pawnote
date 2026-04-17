import type { EntityKind } from "./entity-kind";

export type PublicTeacher = Readonly<{
  id: string;
  name: string;
  kind: typeof EntityKind.Teacher;
  isPrincipal: boolean;
  isTutor: boolean;
  refusesMessages: boolean;
}>;
