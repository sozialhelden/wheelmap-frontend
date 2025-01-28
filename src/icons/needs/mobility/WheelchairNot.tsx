import { Text } from "@radix-ui/themes";

export function WheelchairNot(props) {
  return (
    <Text asChild color="red">
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: title is dependent on context */}
      <svg
        {...props}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="2" width="16" height="16" fill="currentColor" />
      </svg>
    </Text>
  );
}
