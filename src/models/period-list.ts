import type { Period } from "./period";

export type PeriodList = Readonly<{
  periods: Period[];
  /** The default period as advertised by `periodeParDefaut`, or `undefined`. */
  defaultPeriod?: Period;
}>;
