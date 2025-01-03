import { Box, Button, Flex } from "@radix-ui/themes";
import { type FC, useContext } from "react";
import { t } from "ttag";
import { AppContext } from "../../lib/context/AppContext";
import type { PhotonResultFeature } from "../../lib/fetchers/fetchPhotonFeatures";
import { getLocationSettingsUrl } from "../../lib/goToLocationSettings";
import StyledMarkdown from "../shared/StyledMarkdown";
import { LocationNoPermissionPrimaryText, selectProductName } from "./language";

export const LocationNoPermissionStep: FC<{
  onSubmit: (location?: PhotonResultFeature) => unknown;
}> = ({ onSubmit }) => {
  const { clientSideConfiguration } = useContext(AppContext) ?? {};
  const [url] = getLocationSettingsUrl();
  return (
    <Box>
      <StyledMarkdown>
        {LocationNoPermissionPrimaryText(
          selectProductName(clientSideConfiguration),
          url,
        )}
      </StyledMarkdown>
      <Flex gap="3" mt="4" justify="end">
        <Button size="3" onClick={() => onSubmit()}>{t`Letʼs go!`}</Button>
      </Flex>
    </Box>
  );
};
