import { NextRouter } from 'next/router'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { ParsedUrlQueryInput } from 'querystring'
import { YesNoLimitedUnknown, YesNoUnknown } from '../model/ac/Feature'

type ParsedUrlQuery = NextRouter['query']

export type FilterSearchParams = {
  q?: string | null;
  category?: string | null;
  wheelchair?: YesNoLimitedUnknown[] | null;
  toilet?: YesNoUnknown[] | null;
}

export type AppStateSearchParams = FilterSearchParams & ParsedUrlQueryInput

type ParseValue = string | string[] | undefined | null | boolean | number | readonly string[] | readonly number[] | readonly boolean[]

function parseStringParam<T extends string = string>(value: ParseValue): T | null | undefined {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return (typeof value === 'string' ? value : value[0]) as T
}

function parseStringArrayParam<T extends string = string>(value: ParseValue): T[] | null | undefined {
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
  category: parseStringParam(query.category),
  q: parseStringParam(query.q),
  wheelchair: parseStringArrayParam(query.wheelchair),
  toilet: parseStringArrayParam(query.toilet),
})

export const parseQueryInput = (query: ParsedUrlQueryInput): AppStateSearchParams => ({
  category: parseStringParam(query.category),
  q: parseStringParam(query.q),
  wheelchair: parseStringArrayParam(query.wheelchair),
  toilet: parseStringArrayParam(query.toilet),
})

export const parseSearchParams = (search: ReadonlyURLSearchParams | URLSearchParams): AppStateSearchParams => ({
  category: search.has('category') ? parseStringParam(search.get('category')) : undefined,
  q: search.has('q') ? parseStringParam(search.get('q')) : undefined,
  wheelchair: search.has('wheelchair') ? parseStringArrayParam(search.get('wheelchair')) : undefined,
  toilet: search.has('toilet') ? parseStringArrayParam(search.get('toilet')) : undefined,
})
