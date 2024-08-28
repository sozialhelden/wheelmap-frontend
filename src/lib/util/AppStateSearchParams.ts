import { NextRouter } from 'next/router'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { ParsedUrlQueryInput } from 'querystring'
import { YesNoLimitedUnknown, YesNoUnknown } from '../model/ac/Feature'

type ParsedUrlQuery = NextRouter['query']

export type MapSearchParams = {
  zoom?: number;
  lat?: number;
  lon?: number;
  extent?: [number, number, number, number];
}

export type FilterSearchParams = {
  searchQuery?: string;
  category?: string;
  wheelchair?: YesNoLimitedUnknown;
  toilet?: YesNoUnknown;
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
  if (value === undefined || value === null) {
    return undefined
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
  if (!value) {
    return undefined
  }

  const parsedArray = Array.isArray(value) ? value.map(saveParseFloat) : [parseNumberParam(value)]
  const cleanedArray = parsedArray.filter((v) => v !== undefined) as T
  return cleanedArray.length > 0 ? cleanedArray : undefined
}

function parseStringParam<T extends string = string>(value: ParseValue): T {
  if (!value) {
    return undefined
  }
  return (typeof value === 'string' ? value : value[0]) as T
}

export const parseQuery = (query: ParsedUrlQuery): AppStateSearchParams => ({
  lat: parseNumberParam(query.lat),
  lon: parseNumberParam(query.lon),
  zoom: parseNumberParam(query.zoom),
  extent: parseNumberArrayParams(query.extent),
  category: parseStringParam(query.category),
  searchQuery: parseStringParam(query.q),
  wheelchair: parseStringParam(query.wheelchair),
  toilet: parseStringParam(query.toilet),
})

export const parseQueryInput = (query: ParsedUrlQueryInput): AppStateSearchParams => ({
  lat: parseNumberParam(query.lat),
  lon: parseNumberParam(query.lon),
  zoom: parseNumberParam(query.zoom),
  extent: parseNumberArrayParams(query.extent),
  category: parseStringParam(query.category),
  searchQuery: parseStringParam(query.q),
  wheelchair: parseStringParam(query.wheelchair),
  toilet: parseStringParam(query.toilet),
})

export const parseSearchParams = (search: ReadonlyURLSearchParams | URLSearchParams): AppStateSearchParams => ({
  lat: parseNumberParam(search.get('lat')),
  lon: parseNumberParam(search.get('lon')),
  zoom: parseNumberParam(search.get('zoom')),
  extent: parseNumberArrayParams(search.getAll('extent')),
  category: parseStringParam(search.get('category')),
  searchQuery: parseStringParam(search.get('q')),
  wheelchair: parseStringParam(search.get('wheelchair')),
  toilet: parseStringParam(search.get('toilet')),
})
