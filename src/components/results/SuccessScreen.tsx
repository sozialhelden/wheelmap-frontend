import { Check } from "lucide-react";
import { Flex, Strong, Text } from "@radix-ui/themes";

export function SuccessScreen({
  heading,
  text,
}: {
  heading: string;
  text: string;
}) {
  return (
    <Flex direction="column" align="center" justify="center" py="9" px="4">
      <Check color="green" size={48} aria-hidden />
      <Text size="4" align="center">
        <Strong>{heading}</Strong>
      </Text>
      <Text align="center" mt="2">
        {text}
      </Text>
    </Flex>
  );
}
