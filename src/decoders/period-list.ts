import type { Period, PeriodList, SessionHandle } from "~/models";

/**
 * Decode the response of the teacher `ListePeriodes` endpoint by matching
 * each entry's id against `session.instance.periods` (populated at login,
 * with full date info). Entries that are not present in the instance cache
 * are dropped silently.
 */
export const decodePeriodList = (raw: any, session: SessionHandle): PeriodList => {
  const findById = (id: string): Period | undefined =>
    session.instance.periods.find((period) => period.id === id);

  const ids: string[] = (raw.listePeriodes?.V ?? []).map((entry: { N: string }) => entry.N);
  const periods = ids
    .map(findById)
    .filter((period): period is Period => period !== undefined);
  const defaultId: string | undefined = raw.periodeParDefaut?.V?.N;
  const defaultPeriod = defaultId ? findById(defaultId) : undefined;
  return { periods, defaultPeriod };
};
