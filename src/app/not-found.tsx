"use client";

import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { T } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SecondaryButton } from "~/components/button/SecondaryButton";

export default function NotFoundPage() {
  const { back } = useRouter();

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center" gap="12">
      <Box>
        <Heading size="6" mb="2" weight="regular">
          <T _str="Error: 404" />
        </Heading>
        <Heading size="9" mb="6">
          <T _str="Page not found" />
        </Heading>
        <Text>
          <T _str="Sorry, we can't find the page you're looking for." />
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
