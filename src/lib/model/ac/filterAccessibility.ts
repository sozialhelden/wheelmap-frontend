import type { Accessibility } from "@sozialhelden/a11yjson";
import { cloneDeep, isEqual, omit } from "lodash";
import { removeNullAndUndefinedFields } from "../../util/removeNullAndUndefinedFields";
import {
  type YesNoLimitedUnknown,
  type YesNoUnknown,
  yesNoLimitedUnknownArray,
  yesNoUnknownArray,
} from "./Feature";

/** @returns a better structure to represent in the UI than the basic tree structure would provide. */

export default function filterAccessibility(
  properties: Accessibility,
): Partial<Accessibility> {
  const paths = [
    "partiallyAccessibleWith.wheelchair",
    "accessibleWith.wheelchair",
    "areas.0.restrooms.0.isAccessibleWithWheelchair",
    "restrooms.0.isAccessibleWithWheelchair",
    "areas.0.entrances.0.isLevel",
    "entrances.0.isLevel",
  ];

  const props = cloneDeep(properties);
  return removeNullAndUndefinedFields(omit(props, paths));
}

function sortedIsEqual(array1: unknown[], array2: unknown[]): boolean {
  if (array1.length !== array2.length) {
    return false;
  }

  if (!array1 || !array2) {
    return array1 === array2;
  }

  console.log(array1, array2);

  return isEqual(array1.sort(), array2.sort());
}

function parseStatusString<T extends string>(
  statusStringOrStringArray: string | string[],
  allowedStatuses: T[],
): T[] {
  let statusStringArray: string[] | undefined;
  if (typeof statusStringOrStringArray === "string") {
    statusStringArray = statusStringOrStringArray.split(",");
  } else if (Array.isArray(statusStringOrStringArray)) {
    statusStringArray = statusStringOrStringArray;
  }

  // Safe mutable sort as filter always returns a new array.
  return statusStringArray
    ? (statusStringArray
        .filter((s) => allowedStatuses.includes(s as T))
        .sort() as T[])
    : // No explicitly set filter means all status values are allowed.
      [...allowedStatuses];
}

export function getAccessibilityFilterFrom(
  statusString?: string | string[] | null,
): YesNoLimitedUnknown[] {
  return statusString
    ? parseStatusString(statusString, [...yesNoLimitedUnknownArray])
    : [];
}

export function getToiletFilterFrom(
  toiletString?: string | string[] | null,
): YesNoUnknown[] {
  return toiletString
    ? parseStatusString<YesNoUnknown>(toiletString, [...yesNoUnknownArray])
    : [];
}

/**
 * @returns `true` if the given array of accessibility values is actually filtering PoIs
 * (which is not the case if it just contains all existing accessibility values), `false` otherwise.
 */

export function isAccessibilityFiltered(
  accessibilityFilter?: YesNoLimitedUnknown[] | null,
): boolean {
  return (
    !!accessibilityFilter &&
    !isEqual(accessibilityFilter, []) &&
    !sortedIsEqual(accessibilityFilter, [...yesNoLimitedUnknownArray])
  );
}

export function isToiletFiltered(
  toiletFilter?: YesNoUnknown[] | null,
): boolean {
  return (
    !!toiletFilter &&
    !isEqual(toiletFilter, []) &&
    !sortedIsEqual(toiletFilter, [...yesNoUnknownArray])
  );
}
