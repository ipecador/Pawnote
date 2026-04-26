import type { ClassOrGroup } from "~/models";

export const decodeClassOrGroup = (raw: any): ClassOrGroup => ({
  id: raw.N,
  name: raw.L,
  kind: raw.G
});
