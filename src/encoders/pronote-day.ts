/**
 * Encode a Date as a Pronote day-field (no time component).
 *
 * Returns the `{ _T: 7, V }` wrapper expected in Pronote write payloads
 * for date-only fields (e.g. `date`, `datePublication` of an assignment).
 * The hour part is hardcoded to `0:0:0`; day and month are emitted
 * without leading zeros. Uses the local timezone.
 *
 * Distinct from the upstream `encodePronoteDate` which returns a raw
 * string with the Date's live H:M:S.
 *
 * @example
 * encodePronoteDay(new Date(2026, 3, 7));
 * // -> { _T: 7, V: "7/4/2026 0:0:0" }
 */
export const encodePronoteDay = (date: Date): { _T: 7, V: string } => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return {
    _T: 7,
    V: `${day}/${month}/${year} 0:0:0`
  };
};
