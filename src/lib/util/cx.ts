/**
 * Class combiner to generate a well formed class name for components with optional inline logic
 * @example
 * // returns "component" or "component many" or "component active" or "component many active"
 * <MyComponent className={cx("component", items.length > 10 && "many", isActive && "active")} />
 */
export const cx = (
  // for the purpose of type coercion, all falsy kinds are allowed
  ...classNames: (string | undefined | false | void | null | 0)[]
) => classNames.filter((x) => typeof x === 'string').join(' ')
