/**
 * Operation to apply on a discussion attachment when saving a brouillon
 * (`SaisieMessage commande:"brouillon"`) or sending a message
 * (`SaisieMessage commande:""`).
 *
 * - `create`: a freshly uploaded file (via `discussionUploadFile`) to attach
 *   to the brouillon. Carries the upload-side handle (`idFichier`).
 * - `keep`: an already persisted file (server id in `36#…` form) that should
 *   stay attached. Used at send time to re-affirm inclusion.
 * - `delete`: a persisted file to detach from the brouillon.
 */
export type AttachmentChange =
  | Readonly<{ kind: "create"; idFichier: string; name: string }>
  | Readonly<{ kind: "keep"; serverID: string; name: string }>
  | Readonly<{ kind: "delete"; serverID: string; name: string }>;
