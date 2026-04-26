/**
 * Pronote `G` value distinguishing a regular class (`1`) from a cross-class
 * group (`2`) in the `listeClassesGroupes` response and request payloads.
 */
export const ClassOrGroupKind = {
  Class: 1,
  Group: 2
} as const;

export type ClassOrGroup = Readonly<{
  id: string;
  name: string;
  kind: typeof ClassOrGroupKind[keyof typeof ClassOrGroupKind];
}>;
