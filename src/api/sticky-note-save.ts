import { RequestFN } from "~/core/request-function";
import { type SessionHandle, TabLocation } from "~/models";
import { apiProperties } from "./private/api-properties";

/**
 * Save the sticky note ("pense-bête") content on the Pronote homepage.
 * @param session - The current session handle.
 * @param content - The new plain-text content. An empty string clears the note.
 * @returns Nothing.
 */
export const stickyNoteSave = async (session: SessionHandle, content: string): Promise<void> => {
  const properties = apiProperties(session);

  const request = new RequestFN(session, "SaisiePenseBete", {
    [properties.signature]: { onglet: TabLocation.Presence },

    [properties.data]: {
      penseBete: content
    }
  });

  await request.send();
};
