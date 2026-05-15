/**
 * Metadata for a private reply attached to a root discussion:
 * a one-to-one sub-conversation between the current user and a specific
 * participant, anchored to a parent broadcast inside the same thread.
 *
 * Surfaced on `Discussion` so callers can detect unread private replies
 * without fetching the messages list of each discussion.
 */
export type PrivateReplyMeta = Readonly<{
  /** Display name of the peer — the other participant ≠ current user. */
  pair: string
  /** Number of unread messages in this private reply. */
  unreadCount: number
}>;
