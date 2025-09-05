"use client";

import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { T } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SecondaryButton } from "~/components/button/SecondaryButton";

export default function ErrorComponent({
  variant,
}: { variant: "not-found" | "server-error" }) {
  const { back } = useRouter();

  const { title, subtitle, description } = {
    "not-found": {
      title: t("Page not found"),
      subtitle: t("Error: 404"),
      description: t("Sorry, we can't find the page you're looking for."),
    },
    "server-error": {
      title: t("Server error"),
      subtitle: t("Error: 500"),
      description: t(
        "Sorry, something unexpected happened. Our team is already looking into it.",
      ),
    },
  }[variant];

  return (
    <Box>
      <Heading size="6" mb="2" weight="regular">
        {subtitle}
      </Heading>
      <Heading size="9" mb="6">
        {title}
      </Heading>
      <Text>{description}</Text>
      <Flex gap="4" mt="6">
        <SecondaryButton onClick={back}>
          <T _str="Go back" />
        </SecondaryButton>
        <PrimaryButton asChild>
          <Link href="/">
            <T _str="Go to home page" />
          </Link>
        </PrimaryButton>
      </Flex>
    </Box>
  );
}
