/**
 * Thrown when PRONOTE accepts a `SaisieMessage` request at the protocol
 * level (HTTP 200, no `Erreur` field) but rejects its content via the
 * `RapportSaisie._erreurSaisie_` flag — most commonly when one of the
 * attached files in `listeFichiers` is refused (size, type, name conflict
 * not caught client-side, etc.).
 *
 * `messages` carries the original French strings PRONOTE returned in
 * `RapportSaisie._messagesErreur_`, suitable for direct display via toast.
 */
export class DiscussionPostRejectedError extends Error {
  constructor(public readonly messages: string[]) {
    super(messages.join(" · ") || "PRONOTE rejected the discussion post");
    this.name = "DiscussionPostRejectedError";
  }
}
