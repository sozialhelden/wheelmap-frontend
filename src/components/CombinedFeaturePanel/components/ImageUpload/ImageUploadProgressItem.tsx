import { Box, Text } from "@radix-ui/themes";
import React, { type FC, type ReactNode } from "react";

export const ImageUploadProgressItem: FC<{
  children: ReactNode;
  active?: boolean;
}> = ({ children, active }) => {
  return (
    <Text
      color={active ? "blue" : "gray"}
      align="center"
      size={{ initial: "1", xs: "2" }}
      asChild
    >
      <Box py="1">{children}</Box>
    </Text>
  );
};
