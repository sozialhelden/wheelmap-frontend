/**
 * Enforces a format of `@brand_` as branding for types to avoid misnaming brands with unlikely names
 * Brands **can** be hierarchically stacked which may cause accidental satisfying of brands
 * that do not relate with each other.
 * * @example ```ts
 * type A = Brand<{ }, '@brand_base'>
 * type B = Brand<A, '@brand_child'>
 * const fn = (accepts: A) => {}
 * fn({ } as A) // ✅ works
 * fn({ } as B) // ✅ works, B inherited the `@brand_base`
 * ```
 */
export type Brand<Type, Name extends `@brand_${string}`> = Type & {
  [key in Name]: never;
};
