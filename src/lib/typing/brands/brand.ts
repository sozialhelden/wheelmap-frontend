/**
 * Enforces a format of `@my_brand` as branding for types to avoid misnaming brands with unlikely names
 */
export type Brand<Type, Name extends `@brand_${string}`> = Type & { [key in Name]: never }
