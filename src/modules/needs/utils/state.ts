import type { Query, QueryParameterValue } from "~/modules/app-state/app-state";
import { type NeedSelection, settings } from "~/modules/needs/needs";

export function parseNeedQueryParameter(
  value: QueryParameterValue,
): NeedSelection | undefined {
  const nonEmptyValue = typeof value !== "object" || !value ? {} : value;

  const parsedResult = Object.entries(settings).reduce(
    (acc, [key, { needs }]) => {
      if (
        !nonEmptyValue[key] ||
        typeof nonEmptyValue[key] !== "string" ||
        !Object.keys(needs).includes(nonEmptyValue[key])
      ) {
        return acc;
      }
      return Object.assign(acc, { [key]: nonEmptyValue[key] });
    },
    {} as NeedSelection,
  );

  return Object.keys(parsedResult).length ? parsedResult : undefined;
}

export function parseLegacyNeedQueryParameters(
  query: Query,
): undefined | NeedSelection {
  if (!query.wheelchair && !query.toilet) {
    return undefined;
  }

  const mobility = {
    yes: "fully-wheelchair-accessible",
    no: "not-wheelchair-accessible",
    unknown: "no-data",
    limited: "partially-wheelchair-accessible",
  }[query.wheelchair as string];

  const toilet = {
    yes: "fully-wheelchair-accessible",
  }[query.toilet as string];

  return {
    mobility,
    toilet,
  } as NeedSelection;
}
