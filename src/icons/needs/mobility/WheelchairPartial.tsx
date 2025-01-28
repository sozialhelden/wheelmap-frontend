import { Text } from "@radix-ui/themes";

export function WheelchairPartial(props) {
  return (
    <Text asChild color="amber">
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: title is dependent on context */}
      <svg
        {...props}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 0L18.6603 5V15L10 20L1.33975 15V5L10 0Z"
          fill="currentColor"
        />
      </svg>
    </Text>
  );
}
