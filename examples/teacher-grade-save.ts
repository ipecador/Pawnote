import * as pronote from "../src";
import { credentials } from "./_credentials";

/**
 * Demonstrates saving a single grade via `SaisieNotesUnitaire`:
 *
 *   login → classes → period → course → classGrades (read)
 *     → saveTeacherGrade (write one cell)
 *     → classGrades (read again to confirm)
 *
 * Every step is awaited sequentially — PRONOTE's session encrypts a
 * per-request counter and parallel calls desync the client.
 */
void async function main () {
  const session = pronote.createSessionHandle();
  await pronote.loginCredentials(session, {
    url: credentials.pronoteURL,
    kind: pronote.AccountKind.TEACHER,
    username: credentials.username,
    password: credentials.password,
    deviceUUID: credentials.deviceUUID
  });

  const classes = await pronote.classesGroups(session);
  const targetClass = classes.find((c) => c.kind === pronote.ClassOrGroupKind.Class);
  if (!targetClass) throw new Error("No class on this account.");

  const { periods, defaultPeriod } = await pronote.periods(session, targetClass);
  const period = defaultPeriod ?? periods[0];
  if (!period) throw new Error("No period.");

  const coursesList = await pronote.courses(session, targetClass, period);
  const course = coursesList[0]?.subCourses[0] ?? coursesList[0];
  if (!course) throw new Error("No course.");

  const before = await pronote.classGrades(session, targetClass, period, course);
  const assignment = before.assignments[0];
  const student = before.students[0];
  if (!assignment || !student) throw new Error("Need at least one assignment and one student.");

  console.info("Saving grade for", student.name, "on", assignment.title);

  // Save a numeric grade of 10 out of `assignment.outOf`.
  await pronote.saveTeacherGrade(session, assignment.id, { id: student.id, name: student.name }, {
    kind: "numeric",
    value: 10
  });

  // Re-read to confirm.
  const after = await pronote.classGrades(session, targetClass, period, course);
  const updated = after.assignments.find((a) => a.id === assignment.id);
  const updatedGrade = updated?.grades.find((g) => g.studentId === student.id);
  console.info("After save:", updatedGrade?.raw ?? "(no grade)");
}();
