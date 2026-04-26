export type Course = Readonly<{
  id: string;
  name: string;
  subject: { id: string; name: string };
  classRef: { id: string; name: string };
  groupRef?: { id: string; name: string };
  teachers: Array<{ id?: string; name: string }>;
  withoutGrades: boolean;
  subCourses: Course[];
}>;
