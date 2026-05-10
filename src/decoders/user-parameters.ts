import { AccountKind, type LibraryFile, type SessionHandle, type UserParameters } from "~/models";
import { decodeUserAuthorizations } from "./user-authorizations";
import { decodeUserResource } from "./user-resource";

const decodeAttachmentLibrary = (signature: any): LibraryFile[] => {
  const entries = signature?.listeDonnees?.["0"]?.V;
  if (!Array.isArray(entries)) return [];

  return entries.map((e: any) => ({
    id: e.N,
    name: e.L ?? "",
    modifiable: Boolean(e.modifiable)
  }));
};

export const decodeUserParameters = (parameters: any, signature: any, session: SessionHandle): UserParameters => {
  let resources: Array<any>;

  switch (session.information.accountKind) {
    case AccountKind.STUDENT:
    case AccountKind.TEACHER:
    case AccountKind.TEACHER_WEB:
      resources = [parameters.ressource];
      break;
    case AccountKind.PARENT:
      resources = parameters.ressource.listeRessources;
      break;
  }

  return {
    id: parameters.ressource.N,
    kind: parameters.ressource.G,
    name: parameters.ressource.L,
    resources: resources.map((resource) => decodeUserResource(resource, session)),
    authorizations: decodeUserAuthorizations(parameters.autorisations, parameters.listeOnglets),
    attachmentLibrary: decodeAttachmentLibrary(signature)
  };
};
