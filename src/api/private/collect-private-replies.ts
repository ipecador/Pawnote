import type { PrivateReplyMeta } from "~/models";

/**
 * Walk the flattened tree returned by `ListeMessagerie` and collect, for
 * each root discussion (depth=0) index, the metadata of its private reply
 * sub-discussions (depth=1 entries flagged `estUneDiscussion: true`).
 *
 * The mapping back to the root is done via `indicePere`, the index of the
 * parent entry in the raw array.
 */
export const collectPrivateReplies = (raw: any[]): Map<number, PrivateReplyMeta[]> => {
  const byRootIndex = new Map<number, PrivateReplyMeta[]>();

  for (let i = 0; i < raw.length; i++) {
    const entry = raw[i];
    if ((entry.profondeur || 0) !== 1) continue;
    if (!entry.estUneDiscussion) continue;

    const parentIndex: number | undefined = entry.indicePere;
    if (parentIndex === undefined) continue;

    const parent = raw[parentIndex];
    if (!parent || (parent.profondeur || 0) !== 0) continue;

    const list = byRootIndex.get(parentIndex) ?? [];
    list.push({
      pair: entry.initiateur ?? entry.public ?? "",
      unreadCount: entry.nbNonLus ?? 0
    });
    byRootIndex.set(parentIndex, list);
  }

  return byRootIndex;
};
