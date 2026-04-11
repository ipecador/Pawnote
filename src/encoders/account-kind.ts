import { AccountKind } from "~/models";

export const encodeAccountKindToPath = (kind: AccountKind): string => {
  let name: string;
  let mobile = true;

  switch (kind) {
    case AccountKind.STUDENT:
      name = "eleve";
      break;
    case AccountKind.PARENT:
      name = "parent";
      break;
    case AccountKind.TEACHER:
      name = "professeur";
      break;
    case AccountKind.TEACHER_WEB:
      name = "professeur";
      mobile = false;
      break;
  }

  return mobile ? `mobile.${name}.html` : `${name}.html`;
};
