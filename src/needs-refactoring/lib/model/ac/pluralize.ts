import { memoize } from "lodash";

export function pluralize(modelName: string) {
  if (modelName.endsWith("s")) return modelName;
  if (modelName.endsWith("y")) {
    return `${modelName.replace(/y$/, "ie")}s`;
  }
  if (modelName.endsWith("Person") || modelName.endsWith("person")) {
    return modelName.replace(/erson$/, "eople");
  }
  return `${modelName.replace(/y$/, "ie")}s`;
}

export const memoizedPluralize = memoize(pluralize);
