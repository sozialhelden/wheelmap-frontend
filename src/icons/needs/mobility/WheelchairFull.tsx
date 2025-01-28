import { Text } from "@radix-ui/themes";

export function WheelchairFull(props) {
  return (
    <Text asChild color="green">
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: title is dependent on context */}
      <svg
        {...props}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
          fill="currentColor"
        />
      </svg>
    </Text>
  );
}
