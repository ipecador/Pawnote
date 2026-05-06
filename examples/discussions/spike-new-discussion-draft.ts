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

  console.info("✓ API call completed without error.");
  console.info("");
  console.info("Next step — open PRONOTE officiel logged in as the same teacher account.");
  console.info("Go to the 'Brouillons' folder and check that:");
  console.info("  • A draft titled '" + subject + "' is present");
  console.info("  • Its recipient is '" + recipient.name + "'");
  console.info("  • Its content matches the message above");
  console.info("");
  console.info("If yes  → hypothesis VALIDATED, scope B is feasible cleanly.");
  console.info("If no   → API accepted the call but didn't persist a draft, deeper investigation needed.");
  console.info("");
  console.info("Once verified, delete the draft manually from PRONOTE officiel.");
}();
