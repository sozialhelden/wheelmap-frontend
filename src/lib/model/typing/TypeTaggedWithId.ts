import { A11yJSONTypeMapping, AccessibilityCloudTypeMapping } from './AccessibilityCloudTypeMapping'
import { KomootTypeMapping } from './KomootTypeMapping'
import { OSMTypeMapping } from './OSMTypeMapping'

export type TypeMapping = AccessibilityCloudTypeMapping & OSMTypeMapping & KomootTypeMapping & A11yJSONTypeMapping
export type KnownTypeString = keyof TypeMapping
export type HasTypeTag<S extends keyof TypeMapping> = { ['@type']: S; }
export type TypeTagged<S extends keyof TypeMapping> = TypeMapping[S] & HasTypeTag<S>
export type TypeTaggedWithId<S extends keyof TypeMapping> = TypeTagged<S> & { _id: string; }
