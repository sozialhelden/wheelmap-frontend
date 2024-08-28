import { NextRouter } from 'next/router'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { ParsedUrlQueryInput } from 'querystring'
import { YesNoLimitedUnknown, YesNoUnknown } from '../model/ac/Feature'

type ParsedUrlQuery = NextRouter['query']

// undefined can be preserved from previous state, null is cleared
export type MapSearchParams = {
  zoom?: number | null;
  lat?: number | null;
  lon?: number | null;
  extent?: [number, number, number, number] | null;
}

export type FilterSearchParams = {
  q?: string | null;
  category?: string | null;
  wheelchair?: YesNoLimitedUnknown[] | null;
  toilet?: YesNoUnknown[] | null;
}

export type AppStateSearchParams = MapSearchParams & FilterSearchParams & ParsedUrlQueryInput

type ParseValue = string | string[] | undefined | null | boolean | number | readonly string[] | readonly number[] | readonly boolean[]

function saveParseFloat(value: string | undefined | boolean | number) {
  if (value === undefined) {
    return undefined
  }
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0
  }

  const parsedValue = parseFloat(value)
  return Number.isNaN(parsedValue) ? undefined : parsedValue
}

function parseNumberParam(value: ParseValue) {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0
  }

  const stringValue = typeof value === 'string' ? value : value[0]
  return saveParseFloat(stringValue)
}

function parseNumberArrayParams<T extends number[] = number[]>(value: ParseValue) {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }

  const parsedArray = Array.isArray(value) ? value.map(saveParseFloat) : [parseNumberParam(value)]
  const cleanedArray = parsedArray.filter((v) => v !== undefined) as T
  return cleanedArray.length > 0 ? cleanedArray : undefined
}

function parseStringParam<T extends string = string>(value: ParseValue): T {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return (typeof value === 'string' ? value : value[0]) as T
}

function parseStringArrayParam<T extends string = string>(value: ParseValue): T[] {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  if (typeof value === 'string') {
    return [value] as T[]
  }

  return value as T[]
}

export const parseQuery = (query: ParsedUrlQuery): AppStateSearchParams => ({
  lat: parseNumberParam(query.lat),
  lon: parseNumberParam(query.lon),
  zoom: parseNumberParam(query.zoom),
  extent: parseNumberArrayParams(query.extent),
  category: parseStringParam(query.category),
  q: parseStringParam(query.q),
  wheelchair: parseStringArrayParam(query.wheelchair),
  toilet: parseStringArrayParam(query.toilet),
})

export const parseQueryInput = (query: ParsedUrlQueryInput): AppStateSearchParams => ({
  lat: parseNumberParam(query.lat),
  lon: parseNumberParam(query.lon),
  zoom: parseNumberParam(query.zoom),
  extent: parseNumberArrayParams(query.extent),
  category: parseStringParam(query.category),
  q: parseStringParam(query.q),
  wheelchair: parseStringArrayParam(query.wheelchair),
  toilet: parseStringArrayParam(query.toilet),
})

export const parseSearchParams = (search: ReadonlyURLSearchParams | URLSearchParams): AppStateSearchParams => ({
  lat: search.has('lat') ? parseNumberParam(search.get('lat')) : undefined,
  lon: search.has('lon') ? parseNumberParam(search.get('lon')) : undefined,
  zoom: search.has('zoom') ? parseNumberParam(search.get('zoom')) : undefined,
  extent: search.has('extent') ? parseNumberArrayParams(search.getAll('extent')) : undefined,
  category: search.has('category') ? parseStringParam(search.get('category')) : undefined,
  q: search.has('q') ? parseStringParam(search.get('q')) : undefined,
  wheelchair: search.has('wheelchair') ? parseStringArrayParam(search.get('wheelchair')) : undefined,
  toilet: search.has('toilet') ? parseStringArrayParam(search.get('toilet')) : undefined,
})
