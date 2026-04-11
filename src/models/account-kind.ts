export const AccountKind = {
  // Web (non-mobile) space IDs
  TEACHER_WEB: 1,
  // Mobile space IDs
  STUDENT: 6,
  PARENT: 7,
  TEACHER: 8
} as const;

export type AccountKind = typeof AccountKind[keyof typeof AccountKind];
