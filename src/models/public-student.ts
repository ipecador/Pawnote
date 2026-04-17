import type { EntityKind } from "./entity-kind";

export type PublicStudentClass = Readonly<{
  id: string;
  name: string;
}>;

export type PublicStudentGroup = Readonly<{
  id: string;
  name: string;
}>;

export type PublicStudent = Readonly<{
  id: string;
  name: string;
  kind: typeof EntityKind.Student;
  classes: Array<PublicStudentClass>;
  groups: Array<PublicStudentGroup>;
  discussionForbidden: boolean;
}>;
