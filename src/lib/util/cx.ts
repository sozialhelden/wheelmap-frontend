export const cx = (
  // for the purpose of type coercion, all falsy kinds are allowed
  ...classNames: (string | undefined | false | void | null | 0)[]
) => {
  return classNames.filter((x) => typeof x === "string").join(" ");
};
