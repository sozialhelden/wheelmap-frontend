import { FilterAddition } from './useMapFilter'

export interface FilterProperties {
  id?: string
  forLayer?: string
}

export const makeFilterByExactName = (name: string, options?: FilterProperties): FilterAddition => ({
  id: options?.id,
  layer: options?.forLayer,
  expression: ['==', ['get', 'name'], name],
})

export const makeFilterContainsName = (name: string, options?: FilterProperties): FilterAddition => ({
  id: options?.id,
  layer: options?.forLayer,
  expression: ['in', ['get', 'name'], name],
})

/**
 * Create a filter that includes the feature with the given node id
 * @param nodeId Often like `way/129857` or `node/12985481`
 */
export const makeFilterByNode = (nodeId: string, options?: FilterProperties): FilterAddition => ({
  id: options?.id,
  layer: options?.forLayer,
  expression: ['==', ['get', 'id'], nodeId],
})

export const composeOrFilter = (...filters: FilterAddition[]): FilterAddition => ({
  id: filters.find((x) => x.id !== undefined)?.id,
  // eslint-disable-next-line no-nested-ternary
  layer: filters.length > 0 ? filters.every((x) => x.layer === filters[0].layer) ? filters[0].layer : undefined : undefined,
  expression: ['any', ...(filters.map((x) => x.expression)) as any[]],
})

export const composeAndFilter = (...filters: FilterAddition[]): FilterAddition => ({
  id: filters.find((x) => x.id !== undefined)?.id,
  // eslint-disable-next-line no-nested-ternary
  layer: filters.length > 0 ? filters.every((x) => x.layer === filters[0].layer) ? filters[0].layer : undefined : undefined,
  expression: ['all', ...(filters.map((x) => x.expression)) as any[]],
})