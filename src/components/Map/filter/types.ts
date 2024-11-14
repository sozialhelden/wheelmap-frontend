export type TypeFilterOperator = 'array' | 'boolean' | 'collator' | 'format' | 'image' | 'literal' | 'number' | 'number-format'
| 'object' | 'string' | 'to-boolean' | 'to-color' | 'to-number' | 'to-string' | 'typeof'
export type FeatureDataFilterOperator = 'accumulated' | 'feature-state' | 'geometry-type' | 'id' | 'line-progress' | 'properties'
export type LookupFilterOperator = 'at' | 'config' | 'get' | 'has' | 'in' | 'index-of' | 'length' | 'measure-light' | 'slice'
export type DecisionFilterOperator = '!' | '!=' | '<' | '<=' | '==' | '>' | '>=' | 'all' | 'any' | 'case' | 'coalesce' | 'match' | 'within'
export type RampFilterOperator = 'interpolate' | 'interpolate-hcl' | 'interpolate-lab' | 'step'
export type VariableBindingFilterOperator = 'let' | 'var'
export type StringFilterOperator = 'concat' | 'downcase' | 'is-supported-script' | 'resolved-locale' | 'upcase'
export type ColorFilterOperator = 'hsl' | 'hsla' | 'rgb' | 'rgba' | 'to-rgba'
export type MathFilterOperator = '-' | '*' | '/' | '%' | '^' | '+' | 'abs' | 'acos' | 'asin' | 'atan' | 'ceil' | 'cos' | 'distance'
| 'e' | 'floor' | 'ln' | 'ln2' | 'log10' | 'log2' | 'max' | 'min' | 'pi' | 'random' | 'round' | 'sin' | 'sqrt' | 'tan'

export type FilterByCamera = 'distance-from-center' | 'pitch' | 'zoom'
export type FilterByHeatmap = 'heatmap-density'
export type FilterOperator = TypeFilterOperator | FeatureDataFilterOperator | LookupFilterOperator | DecisionFilterOperator
| RampFilterOperator | VariableBindingFilterOperator | StringFilterOperator | ColorFilterOperator | MathFilterOperator
| FilterByCamera | FilterByHeatmap

export type FilterTail = string | number | boolean
export type FilterExpression = [FilterOperator, ...(FilterTail | FilterTail[])[]]

export type HighlightId = string & { __highlightBrand: never }

export type Filter = {
  id: HighlightId,
  expression: FilterExpression,
  layer?: string
}

export type FilterAddition = Omit<Filter, 'id'> & { id?: string }

export interface FilterContext {
  filter: Partial<Record<HighlightId, Filter>>,
  addFilter: (filter: FilterAddition) => Filter,
  remove: (filter: Filter) => void,
  removeById: (id: HighlightId) => void

  readonly listeners: Set<(filter: Partial<Record<HighlightId, Filter>>) => void>
}
