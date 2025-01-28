import { Text } from "@radix-ui/themes";

export function NoData(props) {
  return (
    <Text asChild color="gray">
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: title is dependent on context */}
      <svg
        {...props}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 0L20 10L10 20L0 10L10 0Z" fill="currentColor" />
      </svg>
    </Text>
  );
}
