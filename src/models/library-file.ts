/**
 * Entry from the user's "attachment library" — the list of previously
 * uploaded files that PRONOTE returns inside `Signature.listeDonnees` of
 * every `SaisieMessage commande:"brouillon"` response. Used by the UI
 * layer to detect filename collisions before launching a new upload.
 */
export type LibraryFile = Readonly<{
  /** Server id (e.g. `36#…`). */
  id: string;
  /** Filename as stored on the server. */
  name: string;
  /** Whether the file can be modified or removed by the current user. */
  modifiable: boolean;
}>;
