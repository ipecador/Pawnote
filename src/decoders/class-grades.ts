import type { ClassGrades, SessionHandle } from "~/models";
import { decodeStudent, decodeTeacherAssignment } from "./teacher-assignment";

export const decodeClassGrades = (classGrade: any, session: SessionHandle): ClassGrades => {
  const students = (classGrade.listeEleves?.V ?? []).map(decodeStudent);
  const assignments = (classGrade.listeDevoirs?.V ?? []).map(decodeTeacherAssignment);
  assignments.sort((a: { date: Date }, b: { date: Date }) => a.date.getTime() - b.date.getTime());

  const defaultPeriodId: string | undefined = classGrade.listeClasses?.V?.[0]?.periodeParDefaut?.V?.N;
  const defaultPeriod = defaultPeriodId
    ? session.instance.periods.find((period) => period.id === defaultPeriodId)
    : undefined;

  return { students, assignments, defaultPeriod };
};
