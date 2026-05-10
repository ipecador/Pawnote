import type { FormDataFile } from "@literate.ink/utilities";
import { RequestUpload } from "~/core/request-upload";
import type { SessionHandle } from "~/models";

export type DiscussionUploadedFile = Readonly<{
  /** Upload-side file id (`u_idF`), to pass as `idFichier` in `listeFichiers`. */
  id: string;
  /** Filename as stored on the server (matches the `L` field of the listing). */
  name: string;
}>;

/**
 * Upload a file in the messaging context. The returned `id` is a
 * client-generated handle that must be referenced as `idFichier` when adding
 * the corresponding entry to `listeFichiers` in a `SaisieMessage` brouillon
 * save.
 *
 * Goes through `session.queue` so the encrypted order counter stays
 * sequential with other in-flight pawnote requests.
 */
export const discussionUploadFile = async (
  session: SessionHandle,
  file: FormDataFile,
  fileName: string
): Promise<DiscussionUploadedFile> => {
  return session.queue.push(async () => {
    const upload = new RequestUpload(session, "SaisieMessage", file, fileName);
    await upload.send();

    return {
      id: upload.id,
      name: fileName
    };
  });
};
