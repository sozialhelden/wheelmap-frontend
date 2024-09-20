import {
  createContext, useContext, useState,
} from 'react'

type TypeFilterOperator = 'array' | 'boolean' | 'collator' | 'format' | 'image' | 'literal' | 'number' | 'number-format'
| 'object' | 'string' | 'to-boolean' | 'to-color' | 'to-number' | 'to-string' | 'typeof'
type FeatureDataFilterOperator = 'accumulated' | 'feature-state' | 'geometry-type' | 'id' | 'line-progress' | 'properties'
type LookupFilterOperator = 'at' | 'config' | 'get' | 'has' | 'in' | 'index-of' | 'length' | 'measure-light' | 'slice'
type DecisionFilterOperator = '!' | '!=' | '<' | '<=' | '==' | '>' | '>=' | 'all' | 'any' | 'case' | 'coalesce' | 'match' | 'within'
type RampFilterOperator = 'interpolate' | 'interpolate-hcl' | 'interpolate-lab' | 'step'
type VariableBindingFilterOperator = 'let' | 'var'
type StringFilterOperator = 'concat' | 'downcase' | 'is-supported-script' | 'resolved-locale' | 'upcase'
type ColorFilterOperator = 'hsl' | 'hsla' | 'rgb' | 'rgba' | 'to-rgba'
type MathFilterOperator = '-' | '*' | '/' | '%' | '^' | '+' | 'abs' | 'acos' | 'asin' | 'atan' | 'ceil' | 'cos' | 'distance'
| 'e' | 'floor' | 'ln' | 'ln2' | 'log10' | 'log2' | 'max' | 'min' | 'pi' | 'random' | 'round' | 'sin' | 'sqrt' | 'tan'

type FilterByCamera = 'distance-from-center' | 'pitch' | 'zoom'
type FilterByHeatmap = 'heatmap-density'
type FilterOperator = TypeFilterOperator | FeatureDataFilterOperator | LookupFilterOperator | DecisionFilterOperator | RampFilterOperator
| VariableBindingFilterOperator | StringFilterOperator | ColorFilterOperator | MathFilterOperator | FilterByCamera | FilterByHeatmap

type FilterTail = string | number | boolean
type FilterExpression = [FilterOperator, ...(FilterTail | FilterTail[])[]]

type HighlightId = string & { __highlightBrand: never }

type Filter = {
  source: string,
  expression: FilterExpression,
  layer?: string
}

type FilterContext = {
  filter: Partial<Record<HighlightId, Filter>>,
  addHighlight: (filter: Filter) => HighlightId,
  remove: (sourceOrFilter: string | Filter) => void,
  removeById: (id: HighlightId) => void
}

export const MapFilterContext = createContext<FilterContext>({
  filter: {},
  addHighlight: () => '' as HighlightId,
  remove: () => { },
  removeById: () => { },
})

export const useMapFilter = () => useContext(MapFilterContext)

export const useFilterContextState = (): FilterContext => {
  const [state, setState] = useState<Partial<Record<HighlightId, Filter>>>({})

  return {
    filter: state,
    addHighlight: (filter) => {
      const id = crypto.randomUUID() as HighlightId
      setState({ ...state, [id]: filter })
      return id
    },
    remove: (sourceOrHighlight) => {
      const source = typeof sourceOrHighlight === 'string' ? sourceOrHighlight : sourceOrHighlight.source
      const replacement = {} as Partial<Record<HighlightId, Filter>>
      const entries = Object.entries(state)
      for (let i = 0; i < entries.length; i += 1) {
        const [key, value] = entries[i]
        if (value && value.source !== source) {
          replacement[key] = value
        }
      }
      setState(replacement)
    },
    removeById: (id) => {
      const replacement = {} as Partial<Record<HighlightId, Filter>>
      const entries = Object.entries(state)

      for (let i = 0; i < entries.length; i += 1) {
        const [key, value] = entries[i]
        if (key === id) {
          // b...please.
          // eslint-disable-next-line no-continue
          continue
        }
        replacement[key] = value
      }
      setState(replacement)
    },
  }
}

export const filterForLayer = (id: string | undefined, filter: Partial<Record<HighlightId, Filter>>) => {
  const filters = Object
    .values(filter)
    .filter((x) => x?.layer === undefined || x.layer === id)
    .map((x) => x?.expression)
    .filter((x) => !!x)
  if (filters.length > 1) {
    return ['any', filters]
  }
  if (filters.length === 1) {
    return filters[0]
  }
  return undefined
}
