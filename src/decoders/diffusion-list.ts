import type { DiffusionList, DiffusionListMember } from "~/models";

const decodeMember = (raw: any): DiffusionListMember => ({
  id: raw.N,
  name: raw.L,
  kind: raw.G,
});

export const decodeDiffusionList = (raw: any): DiffusionList => ({
  id: raw.N,
  name: raw.L,
  isPublic: raw.estPublique ?? false,
  isAuthor: raw.estAuteur ?? false,
  authorLabel: raw.libelleAuteur ?? "",
  members: (raw.listePublicIndividu?.V ?? []).map(decodeMember),
});
