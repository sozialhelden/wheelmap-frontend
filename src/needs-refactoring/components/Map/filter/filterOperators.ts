import type {
  Filter,
  FilterAddition,
  FilterExpression,
  FilterTail,
  HighlightId,
} from "./types";

export interface FilterProperties {
  id?: string;
  forLayer?: string;
}

/**
 * Create a filter that includes the feature with the given node id
 * @param nodeId Often like `way/129857` or `node/12985481`
 */
export const makeFilterById = (
  nodeId: string,
  options?: FilterProperties,
): FilterAddition => ({
  id: options?.id,
  layer: options?.forLayer,
  expression: ["==", ["get", "id"], nodeId],
});

/**
 * Retrieves filters applicable for the name of the layer to be displayed
 */
export const filterForLayer = (
  id: string | undefined,
  filter: Partial<Record<HighlightId, Filter>>,
) => {
  const filters = Object.values(filter)
    .filter((x) => x?.layer === undefined || x.layer === id)
    .map((x) => x?.expression)
    .filter((x) => !!x);

  if (filters.length > 1) {
    return filter[0];
  }
  if (filters.length === 1) {
    return filters[0];
  }
  return undefined;
};
