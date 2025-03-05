import { AlertDialog, Box, Button, Dialog, Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { type FC, useContext } from "react";
import { AppContext } from "../../lib/context/AppContext";
import StyledMarkdown from "../shared/StyledMarkdown";
import {
  LocationFailedStepPrimaryText,
  getProductName,
} from "./getProductName";

export const LocationFailedStep: FC<{
  onSubmit: () => unknown;
}> = ({ onSubmit }) => {
  const { clientSideConfiguration } = useContext(AppContext) ?? {};
  const productName = getProductName(clientSideConfiguration);

  return (
    <Box>
      <AlertDialog.Title>
        {/* translator: The text shows when a location permission had been granted but failed to be acquired for other reasons */}
        {t("Could not determine location.")}
      </AlertDialog.Title>

      <AlertDialog.Description>
        <StyledMarkdown>
          {/* translator: The text shows when a location permission had been granted but failed to be acquired for other reasons */}
          {t(
            `You can still use all features of ${productName}. Search for places, or pan and zoom the map to explore the world.`,
          )}
        </StyledMarkdown>
      </AlertDialog.Description>

      <Flex gap="3" mt="4" justify="end">
        <AlertDialog.Action>
          <Button onClick={onSubmit}>{t("Let’s go!")}</Button>
        </AlertDialog.Action>
      </Flex>
    </Box>
  );
};
