import { t } from "ttag";
import { AppContext } from "../../lib/context/AppContext";
import StyledMarkdown from "../shared/StyledMarkdown";
import { LocationFailedStepPrimaryText, selectProductName } from "./language";
import { Box, Button, Flex } from "@radix-ui/themes";
import { type FC, useContext } from "react";

export const LocationFailedStep: FC<{
  onSubmit: () => unknown;
}> = ({ onSubmit }) => {
  const { clientSideConfiguration } = useContext(AppContext) ?? {};

  return (
    <Box>
      <StyledMarkdown>
        {LocationFailedStepPrimaryText(
          selectProductName(clientSideConfiguration),
        )}
      </StyledMarkdown>
      <Flex gap="3" mt="4" justify="end">
        <Button onClick={onSubmit}>{t`Letʼs go!`}</Button>
      </Flex>
    </Box>
  );
};
