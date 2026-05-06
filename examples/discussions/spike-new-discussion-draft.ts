import * as pronote from "../../src";
import { credentials } from "../_credentials";

void async function main () {
  const session = pronote.createSessionHandle();
  await pronote.loginCredentials(session, {
    url: credentials.pronoteURL,
    kind: pronote.AccountKind.TEACHER,
    username: credentials.teacher_username,
    password: credentials.teacher_password,
    deviceUUID: credentials.deviceUUID
  });

  if (!session.user.authorizations.canDiscuss)
    throw new Error("This account can't discuss, review the permissions.");

  // Mirror the web app's contact discovery: use the public-* APIs (which
  // a teacher account can access) and fall back across roles until we find
  // at least one recipient. Teacher → Personal → Student → Parent.
  let recipient: pronote.NewDiscussionRecipient | undefined;
  let usedKind: string = "";

  const teachers = await pronote.publicTeachers(session);
  if (teachers.length > 0) {
    const t = teachers[0];
    recipient = { id: t.id, name: t.name, kind: t.kind, isPrincipal: false, subjects: [] };
    usedKind = "Teacher";
  }

  if (!recipient) {
    const staff = await pronote.publicStaff(session);
    if (staff.length > 0) {
      const s = staff[0];
      recipient = { id: s.id, name: s.name, kind: s.kind, isPrincipal: false, subjects: [] };
      usedKind = "Personal (staff)";
    }
  }

  if (!recipient) {
    const students = await pronote.publicStudents(session);
    if (students.length > 0) {
      const s = students[0];
      recipient = { id: s.id, name: s.name, kind: s.kind, isPrincipal: false, subjects: [] };
      usedKind = "Student";
    }
  }

  if (!recipient) {
    const parents = await pronote.publicParents(session);
    if (parents.length > 0) {
      const p = parents[0];
      // Parent is not in NewDiscussionRecipient's kind union, but the web
      // app casts through this same path — the runtime payload accepts it.
      recipient = { id: p.id, name: p.name, kind: p.kind as pronote.NewDiscussionRecipient["kind"], isPrincipal: false, subjects: [] };
      usedKind = "Responsable (parent)";
    }
  }

  if (!recipient)
    throw new Error("No recipients across Teacher/Personal/Student/Parent — account configuration likely too restricted.");

  console.info("Recipient picked from public-* list:", usedKind);
  const stamp = Date.now();
  const subject = `[SPIKE] new-discussion draft ${stamp}`;
  const content = `<p>Spike: testing whether PRONOTE accepts a "brouillon" command with non-empty objet/listeDestinataires (stamp ${stamp}).</p>`;

  console.info("Creating new-discussion draft via the brouillon command...");
  console.info("  Subject:    ", subject);
  console.info("  Recipient:  ", recipient.name);
  console.info("  Content:    ", content);
  console.info("");

  await pronote.discussionCreateNewDiscussionDraft(session, subject, content, [recipient]);

  console.info("✓ Create API call completed without error.");
  console.info("");

  // Spike #2 — discover the sendAction value PRONOTE returns for a
  // new-discussion draft. If sendAction is defined here, the existing
  // discussionSendDraft (used for replies) should work as-is for sending
  // a new-discussion draft, and we don't need a separate API function.
  console.info("Inspecting the draft to discover sendAction…");
  const all = await pronote.discussions(session);
  const draftDiscussion = all.items.find((d) => d.subject === subject);
  if (!draftDiscussion) {
    console.warn("  Draft discussion not found in the discussions list — abort inspection.");
    console.warn("  This usually means PRONOTE didn't persist the draft (revisit the spike).");
    return;
  }

  const messages = await pronote.discussionMessages(session, draftDiscussion);
  console.info("");
  console.info("  Found draft as Discussion id    :", draftDiscussion.participantsMessageID);
  console.info("  numberOfMessages (sent count)   :", messages.sents.length);
  console.info("  numberOfDrafts (drafts in obj)  :", messages.drafts.length);
  console.info("  sendAction (button.G expected)  :", messages.sendAction);
  console.info("  canIncludeStudentsAndParents    :", messages.canIncludeStudentsAndParents);
  if (messages.drafts[0]) {
    console.info("  drafts[0].possessionID          :", messages.drafts[0].possessionID);
    console.info("  drafts[0].replyMessageID        :", messages.drafts[0].replyMessageID);
    console.info("  drafts[0].isHTML                :", messages.drafts[0].isHTML);
  }
  console.info("");
  console.info("Interpreting sendAction:");
  console.info("  0 = Send                                  (likely for new-disc drafts)");
  console.info("  1 = SendEveryone                          (likely)");
  console.info("  2 = ReplyEveryone                         (reply)");
  console.info("  3 = SendEveryoneExceptParentsAndStudents  (likely)");
  console.info("  4 = ReplyEveryoneExceptParentsAndStudents (reply)");
  console.info("  5 = Close");
  console.info("  undefined → cannot send via discussionSendDraft, need different mechanism");
  console.info("");
  console.info("If sendAction is defined → existing discussionSendDraft should work as-is.");
  console.info("Don't forget to delete the draft manually from PRONOTE officiel.");
}();
