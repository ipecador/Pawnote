import { describe, expect, it } from "bun:test";
import type { Course, Period, TeacherAssignmentInput } from "~/models";
import { encodeServiceBlock, encodeTeacherAssignmentEntry } from "./teacher-assignment";

const SAMPLE_COURSE: Course = {
  id: "131#course",
  name: "PHYSIQUE-CHIMIE",
  subject: { id: "79#subject", name: "PHYSIQUE-CHIMIE" },
  classRef: { id: "23#class", name: "5E" },
  teachers: [],
  withoutGrades: false,
  subCourses: [],
  coefficientGeneral: 1,
  facultatif: false
};

const SAMPLE_PERIOD: Period = {
  id: "105#period",
  name: "Semestre 2",
  kind: 2,
  startDate: new Date(2026, 0, 1),
  endDate: new Date(2026, 6, 1)
};

const BASE_INPUT: TeacherAssignmentInput = {
  title: "TP poudre magique",
  date: new Date(2026, 3, 7),
  outOf: 10,
  coefficient: 1,
  locked: false,
  asBonus: false,
  asGrade: false,
  rescaledTo20: false
};

describe("encodeTeacherAssignmentEntry", () => {
  it("emits N: -1 and E: 1 in create mode", () => {
    const entry = encodeTeacherAssignmentEntry(BASE_INPUT, SAMPLE_COURSE, SAMPLE_PERIOD, { kind: "create" });
    expect(entry.N).toBe(-1);
    expect(entry.E).toBe(1);
  });

  it("emits the existing id and E: 2 in update mode", () => {
    const entry = encodeTeacherAssignmentEntry(
      BASE_INPUT,
      SAMPLE_COURSE,
      SAMPLE_PERIOD,
      { kind: "update", assignmentId: "33#existing" }
    );
    expect(entry.N).toBe("33#existing");
    expect(entry.E).toBe(2);
  });

  it("emits the existing id and E: 3 in delete mode", () => {
    const entry = encodeTeacherAssignmentEntry(
      BASE_INPUT,
      SAMPLE_COURSE,
      SAMPLE_PERIOD,
      { kind: "delete", assignmentId: "33#existing" }
    );
    expect(entry.N).toBe("33#existing");
    expect(entry.E).toBe(3);
  });

  it("emits a full metadata payload in delete mode (mirrors the HAR)", () => {
    const entry = encodeTeacherAssignmentEntry(
      { ...BASE_INPUT, title: "Test", outOf: 25, coefficient: 2 },
      SAMPLE_COURSE,
      SAMPLE_PERIOD,
      { kind: "delete", assignmentId: "33#existing" }
    );
    expect(entry.commentaire).toBe("Test");
    expect(entry.bareme).toEqual({ _T: 10, V: "25,00" });
    expect(entry.coefficient).toEqual({ _T: 10, V: "2,00" });
    expect(entry.date).toEqual({ _T: 7, V: "7/4/2026 0:0:0" });
    expect(entry.ListeThemes).toEqual([]);
    expect(entry.listeClasses).toHaveLength(1);
  });

  it("places the title under `commentaire`", () => {
    const entry = encodeTeacherAssignmentEntry(BASE_INPUT, SAMPLE_COURSE, SAMPLE_PERIOD, { kind: "create" });
    expect(entry.commentaire).toBe("TP poudre magique");
  });

  it("encodes date and publicationDate with the day-field format", () => {
    const entry = encodeTeacherAssignmentEntry(BASE_INPUT, SAMPLE_COURSE, SAMPLE_PERIOD, { kind: "create" });
    expect(entry.date).toEqual({ _T: 7, V: "7/4/2026 0:0:0" });
    expect(entry.datePublication).toEqual({ _T: 7, V: "7/4/2026 0:0:0" });
  });

  it("uses explicit publicationDate when provided", () => {
    const entry = encodeTeacherAssignmentEntry(
      { ...BASE_INPUT, publicationDate: new Date(2026, 4, 1) },
      SAMPLE_COURSE,
      SAMPLE_PERIOD,
      { kind: "create" }
    );
    expect(entry.datePublication).toEqual({ _T: 7, V: "1/5/2026 0:0:0" });
  });

  it("encodes bareme and coefficient as comma-decimals", () => {
    const entry = encodeTeacherAssignmentEntry(BASE_INPUT, SAMPLE_COURSE, SAMPLE_PERIOD, { kind: "create" });
    expect(entry.bareme).toEqual({ _T: 10, V: "10,00" });
    expect(entry.coefficient).toEqual({ _T: 10, V: "1,00" });
  });

  it("mirrors the boolean flags", () => {
    const entry = encodeTeacherAssignmentEntry(
      { ...BASE_INPUT, locked: true, asBonus: true, asGrade: true, rescaledTo20: true },
      SAMPLE_COURSE,
      SAMPLE_PERIOD,
      { kind: "create" }
    );
    expect(entry.verrouille).toBe(true);
    expect(entry.commeUnBonus).toBe(true);
    expect(entry.commeUneNote).toBe(true);
    expect(entry.ramenerSur20).toBe(true);
  });

  it("omits `categorie` when no categoryId is provided", () => {
    const entry = encodeTeacherAssignmentEntry(BASE_INPUT, SAMPLE_COURSE, SAMPLE_PERIOD, { kind: "create" });
    expect(entry.categorie).toBeUndefined();
  });

  it("includes `categorie` with N and L when categoryId is provided", () => {
    const entry = encodeTeacherAssignmentEntry(
      { ...BASE_INPUT, categoryId: "170#cat", categoryName: "Travail de groupe" },
      SAMPLE_COURSE,
      SAMPLE_PERIOD,
      { kind: "create" }
    );
    expect(entry.categorie).toEqual({ N: "170#cat", L: "Travail de groupe" });
  });

  it("builds the single-entry listeClasses from course and period", () => {
    const entry = encodeTeacherAssignmentEntry(BASE_INPUT, SAMPLE_COURSE, SAMPLE_PERIOD, { kind: "create" });
    expect(entry.listeClasses).toEqual([{
      N: "23#class",
      L: "5E",
      service: { N: "131#course", L: "PHYSIQUE-CHIMIE" },
      periodePrincipale: { N: "105#period", L: "Semestre 2" },
      periodeSecondaire: { N: 0 }
    }]);
  });

  it("includes empty ListeThemes, listeSujets, listeCorriges, listeEleves", () => {
    const entry = encodeTeacherAssignmentEntry(BASE_INPUT, SAMPLE_COURSE, SAMPLE_PERIOD, { kind: "create" });
    expect(entry.ListeThemes).toEqual([]);
    expect(entry.listeSujets).toEqual([]);
    expect(entry.listeCorriges).toEqual([]);
    expect(entry.listeEleves).toEqual([]);
  });
});

describe("encodeServiceBlock", () => {
  it("uses course-derived coefficientGeneral when available", () => {
    const block = encodeServiceBlock({ ...SAMPLE_COURSE, coefficientGeneral: 1.5 });
    expect(block.coefficientGeneral).toEqual({ _T: 10, V: "1,50" });
  });

  it("falls back to coefficientGeneral 1 when missing", () => {
    const block = encodeServiceBlock({ ...SAMPLE_COURSE, coefficientGeneral: undefined });
    expect(block.coefficientGeneral).toEqual({ _T: 10, V: "1,00" });
  });

  it("uses course.facultatif when set", () => {
    const block = encodeServiceBlock({ ...SAMPLE_COURSE, facultatif: true });
    expect(block.facultatif).toBe(true);
  });

  it("defaults facultatif to false when missing", () => {
    const block = encodeServiceBlock({ ...SAMPLE_COURSE, facultatif: undefined });
    expect(block.facultatif).toBe(false);
  });

  it("emits the hardcoded defaults for the remaining fields", () => {
    const block = encodeServiceBlock(SAMPLE_COURSE);
    expect(block.moyenneParSousMatiere).toBe(false);
    expect(block.moyenneBulletinSurClasse).toBe(false);
    expect(block.avecDevoirSupMoy).toBe(false);
    expect(block.avecBonusMalus).toBe(false);
    expect(block.ponderationNotePlusHaute).toEqual({ _T: 10, V: "1,00" });
    expect(block.ponderationNotePlusBasse).toEqual({ _T: 10, V: "1,00" });
    expect(block.arrondiEleve).toEqual({ _T: 14, V: 7 });
    expect(block.arrondiClasse).toEqual({ _T: 14, V: 0 });
  });
});
