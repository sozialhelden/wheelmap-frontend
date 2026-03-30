import type { QueryParameterValue } from "~/modules/app-state/app-state";

function parseBooleanQueryParameter(value: QueryParameterValue): boolean {
  // The value can be the string "true" (from query params) or a boolean true
  // (from JSON-parsed localStorage persistence).
  return value === "true" || (value as unknown) === true;
}

export function parseOnboardingCompletedQueryParameter(
  value: QueryParameterValue,
): boolean {
  return parseBooleanQueryParameter(value);
}

export function parseLocateQueryParameter(value: QueryParameterValue): boolean {
  return parseBooleanQueryParameter(value);
}
