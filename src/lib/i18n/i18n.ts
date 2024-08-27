import { Locale } from './Locale'
import { localeFromString } from './localeFromString'

export const defaultLocale = localeFromString('en-us')
export const currentLocales: Locale[] = ['en-us', 'en'].map(localeFromString)
