import { RequestFN } from "~/core/request-function";
import { decodeDiscussion } from "~/decoders/discussion";
import { decodeDiscussionFolder } from "~/decoders/discussion-folder";
import { type Discussion, type Discussions, TabLocation, type SessionHandle } from "~/models";
import type { _DiscussionsCache } from "./private/discussions-cache";
import { apiProperties } from "./private/api-properties";
import { collectPrivateReplies } from "./private/collect-private-replies";

/**
 * Retrieve discussions from the server.
 * @param session - The current session handle.
 * @param cache - The cache to store discussions.
 * @returns A promise that resolves to the discussions.
 */
export const discussions = async (session: SessionHandle, cache: _DiscussionsCache = {_:[]}): Promise<Discussions> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "ListeMessagerie", {
    [properties.signature]: { onglet: TabLocation.Discussions },

    [properties.data]: {
      avecLu: true,
      avecMessage: true,
      possessionMessageDiscussionUnique: null
    }
  });

  const response = await request.send();
  const data = response.data[properties.data];

  const folders = data.listeEtiquettes.V.map(decodeDiscussionFolder);

  // PRONOTE's listeMessagerie is a flattened tree: depth=0 entries are
  // root discussions; depth=1 entries can be either messages of a root or
  // private reply sub-discussions flagged `estUneDiscussion`.
  // We surface the latter on each root via `privateReplies` so the inbox
  // can show unread counts without fetching each thread's messages.
  const raw: any[] = data.listeMessagerie.V;
  const privateRepliesByRootIndex = collectPrivateReplies(raw);

  const items: Discussion[] = raw
    .map((entry: any, index: number) => ({ entry, index }))
    .filter(({ entry }: { entry: any }) => {
      const hasZeroDepth = (entry.profondeur || 0) === 0;
      const hasParticipants = entry.messagePourParticipants?.V.N;
      return entry.estUneDiscussion && hasParticipants && hasZeroDepth;
    })
    .map(({ entry, index }: { entry: any; index: number }) =>
      decodeDiscussion(entry, folders, cache, privateRepliesByRootIndex.get(index) ?? [])
    );

  // This is a trick to keep the reference to the items
  // in the cache, while updating the items.
  cache._.length = 0;
  cache._.push(...items);

  for (const item of cache._) {
    if (item.participantsMessageID in cache) {
      // Mutate the reference directly in cache.
      Object.assign(cache[item.participantsMessageID], item);
    }
    else {
      // Create the reference in cache.
      cache[item.participantsMessageID] = item;
    }
  }

  // Delete outdated keys, in case there are any.
  for (const key in cache) {
    if (key === "_") continue;
    if (!cache._.find((item) => item.participantsMessageID === key)) {
      delete cache[key];
    }
  }

  return {
    folders,
    // Instead of returning the items, we return
    // the reference to the items in the cache.
    items: cache._
  };
};
