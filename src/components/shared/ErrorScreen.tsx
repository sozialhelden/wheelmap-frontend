import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Flex, Strong, Text } from "@radix-ui/themes";
import { t } from "@transifex/native";
import React from "react";

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
      <ExclamationTriangleIcon color="red" width="40" height="40" />
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
