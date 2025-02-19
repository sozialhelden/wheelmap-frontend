export function getUniqueId(): string {
  return (
    "i-" +
    Number.parseInt(
      Math.ceil(Math.random() * Date.now())
        .toPrecision(16)
        .toString()
        .replace(".", ""),
    )
  );
}
