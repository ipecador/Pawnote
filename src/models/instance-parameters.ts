import type { Holiday } from "./holiday";
import type { Period } from "./period";
import type { WeekFrequency } from "./week-frequency";

export type InstanceParameters = Readonly<{
  nextBusinessDay: Date
  firstMonday: Date
  firstDate: Date
  lastDate: Date

  /**
   * Allows to recognize the device for next authentications.
   */
  navigatorIdentifier: string
  version: number[]
  startings: string[]
  endings: string[]
  periods: Period[]
  holidays: Holiday[]
  weekFrequencies: Map<number, WeekFrequency>
  blocksPerDay: number
  /**
   * Open weekdays of the week, using Pronote's 1-indexed convention
   * (1 = Monday ... 7 = Sunday). Example for Mon-Fri: `[1, 2, 3, 4, 5]`.
   */
  openWeekdays: number[]
  /**
   * Open half-days of the week for mornings, 0-indexed (0 = Monday).
   */
  openMornings: number[]
  /**
   * Open half-days of the week for afternoons, 0-indexed (0 = Monday).
   */
  openAfternoons: number[]
}>;
