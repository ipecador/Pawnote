import type { LibraryFile } from "./library-file";
import type { UserAuthorizations } from "./user-authorizations";
import type { UserResource } from "./user-resource";

export type UserParameters = Readonly<{
  id: string
  kind: number
  name: string

  authorizations: UserAuthorizations
  resources: Array<UserResource>

  /**
   * Snapshot of the user's attachment library at session start, returned
   * by PRONOTE inside the `ParametresUtilisateur` response signature.
   * Used by the web layer to seed the collision-detection cache before
   * any messaging save has happened.
   */
  attachmentLibrary: Array<LibraryFile>
}>;
