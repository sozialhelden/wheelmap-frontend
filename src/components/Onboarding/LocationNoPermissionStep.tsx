import { AlertDialog, Box, Button, Flex } from "@radix-ui/themes";
import { type FC, useContext } from "react";
import { t } from "ttag";
import { AppContext } from "../../lib/context/AppContext";
import type { PhotonResultFeature } from "../../lib/fetchers/fetchPhotonFeatures";
import { getLocationSettingsUrl } from "../../lib/goToLocationSettings";
import StyledMarkdown from "../shared/StyledMarkdown";
import {
  LocationNoPermissionPrimaryText,
  gerProductName,
} from "./gerProductName";

export const LocationNoPermissionStep: FC<{
  onSubmit: (location?: PhotonResultFeature) => unknown;
}> = ({ onSubmit }) => {
  const { clientSideConfiguration } = useContext(AppContext) ?? {};
  const productName = gerProductName(clientSideConfiguration);
  const [url] = getLocationSettingsUrl();

  return (
    <Box>
      <AlertDialog.Description>
        <StyledMarkdown>
          {
            // translator: The text shows when a location perrmision has not been given
            t`
              **No Problem!** If you change your mind, grant location permissions for ${productName} in [your deviceʼs location settings](${url}).
              You can still use all features of the app.
            `
          }
        </StyledMarkdown>
      </AlertDialog.Description>
      <Flex gap="3" mt="4" justify="end">
        <AlertDialog.Action>
          <Button size="3" onClick={() => onSubmit()}>{t`Let’s go!`}</Button>
        </AlertDialog.Action>
      </Flex>
    </Box>
  );
};
