import { CheckIcon } from "@radix-ui/react-icons";
import { Button, Flex, Strong, Text } from "@radix-ui/themes";
import React, { type MouseEventHandler } from "react";
import { t } from "ttag";

export function SuccessScreen({
  heading,
  text,
}: {
  heading: string;
  text: string;
}) {
  return (
    <Flex direction="column" align="center" justify="center" py="9" px="4">
      <CheckIcon color="green" width="50" height="50" aria-hidden />
      <Text size="4" align="center">
        <Strong>{heading}</Strong>
      </Text>
      <Text align="center" mt="2">
        {text}
      </Text>
    </Flex>
  );
}
