import { type AttachmentChange, DocumentKind, EntityState } from "~/models";
import { createEntityID } from "../helpers/entity-id";

/**
 * Translate the high-level `AttachmentChange[]` into the wire-format items
 * that PRONOTE expects in the `listeFichiers` array of a `SaisieMessage`
 * payload (both `commande:"brouillon"` and `commande:""`).
 */
export const buildListeFichiers = (files: AttachmentChange[] | undefined): any[] => {
  if (!files?.length) return [];

  return files.map((entry) => {
    switch (entry.kind) {
      case "create":
        return {
          E: EntityState.CREATION,
          G: DocumentKind.FILE,
          L: entry.name,
          N: createEntityID(),
          idFichier: entry.idFichier
        };
      case "keep":
        return {
          E: EntityState.CREATION,
          G: DocumentKind.FILE,
          L: entry.name,
          N: entry.serverID
        };
      case "delete":
        return {
          E: EntityState.DELETION,
          G: DocumentKind.FILE,
          L: entry.name,
          N: entry.serverID
        };
    }
  });
};
