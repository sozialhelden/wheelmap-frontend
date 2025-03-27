"use client";

import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { T } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PrimaryButton, SecondaryButton } from "~/components/shared/Buttons";

export default function NotFoundPage() {
  const { back } = useRouter();

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center" gap="12">
      <Box>
        <Heading size="9" mb="6">
          <T _str="Not available in beta" />
        </Heading>
        <Text>
          <T _str="Sorry, this page is not yet available in the beta version. But it will be part of a later realease." />
        </Text>
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
    </Flex>
  );
}
