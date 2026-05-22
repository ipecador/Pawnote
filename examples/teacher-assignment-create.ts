import * as pronote from "../src";
import { credentials } from "./_credentials";

/**
 * Walk through the full create-then-read flow for a teacher gradebook column:
 *
 *   login → classesGroups → periods → courses → classGrades (before)
 *     → createTeacherAssignment → classGrades (after)
 *
 * Every step is awaited sequentially: PRONOTE's session encrypts a per-request
 * counter and parallel calls desync the client.
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
  console.info("Class →", targetClass.name);

  const { periods, defaultPeriod } = await pronote.periods(session, targetClass);
  const period = defaultPeriod ?? periods[0];
  if (!period) throw new Error("No period for this class.");
  console.info("Period →", period.name);

  const coursesList = await pronote.courses(session, targetClass, period);
  const course = coursesList[0]?.subCourses[0] ?? coursesList[0];
  if (!course) throw new Error("No course for this class+period.");
  console.info("Course →", course.subject.name);

  const before = await pronote.classGrades(session, targetClass, period, course);
  console.info("Before: ", before.assignments.length, "assignment(s)");

  const newId = await pronote.createTeacherAssignment(session, targetClass, period, course, {
    title: "Devoir test (à supprimer)",
    date: new Date(),
    outOf: 20,
    coefficient: 1,
    locked: false,
    asBonus: false,
    asGrade: false,
    rescaledTo20: false
  });
  console.info("Created assignment with id →", newId);

  const after = await pronote.classGrades(session, targetClass, period, course);
  console.info("After:  ", after.assignments.length, "assignment(s)");

  const created = after.assignments.find((a) => a.id === newId);
  if (created) {
    console.info("Round-trip OK — '", created.title, "' /", created.outOf, "coef", created.coefficient);
  }
  else {
    console.warn("Created id was not found in the post-create response — check the period.");
  }
}();
