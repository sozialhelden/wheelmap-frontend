import { kebabCase, memoize } from "lodash";

export const memoizedKebabCase = memoize(kebabCase);
