/**
 * Encode a number as a Pronote decimal-field.
 *
 * Returns the `{ _T: 10, V }` wrapper expected in Pronote write payloads
 * for decimal fields (e.g. `bareme`, `coefficient`, `note`). The value is
 * formatted with two decimals and a comma as the decimal separator (French
 * locale convention used by Pronote internally).
 *
 * @example
 * encodePronoteDecimal(1);     // -> { _T: 10, V: "1,00" }
 * encodePronoteDecimal(10.5);  // -> { _T: 10, V: "10,50" }
 */
export const encodePronoteDecimal = (value: number): { _T: 10, V: string } => {
  return {
    _T: 10,
    V: value.toFixed(2).replace(".", ",")
  };
};
