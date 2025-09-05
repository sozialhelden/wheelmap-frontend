"use client";

import { Flex } from "@radix-ui/themes";
import ErrorComponent from "~/components/Error";

export default function ErrorPage() {
  return (
    <Flex height="100vh" width="100vw" align="center" justify="center" gap="12">
      <ErrorComponent variant="server-error" />
    </Flex>
  );
}
