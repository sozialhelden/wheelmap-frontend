import { TriangleAlert } from "lucide-react";
import { Flex, Strong, Text } from "@radix-ui/themes";
import { t } from "@transifex/native";

export function ErrorScreen({
  heading,
  text,
  error,
}: {
  heading: string;
  text: string;
  error: string;
}) {
  return (
    <Flex direction="column" align="center" justify="center" py="9" px="4">
      <TriangleAlert color="red" size={48} aria-hidden />
      <Text>
        <Strong>{heading}</Strong>
      </Text>
      <Text>{text}</Text>
      <Text color="gray" align="center" mt="6">
        {t("Error: {error}", { error })}
      </Text>
    </Flex>
  );
}
