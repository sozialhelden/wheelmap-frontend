import { AlertDialog, Box, Button, Flex, Spinner } from "@radix-ui/themes";
import { t } from "@transifex/native";
import type { FC } from "react";
import { useLocationSettingsUrl } from "~/needs-refactoring/lib/goToLocationSettings";
import { cx } from "~/needs-refactoring/lib/util/cx";
import { useGeolocationPermission } from "./useGeolocationPermission"; // oeuf, there are many exit points that may be consolidated:
import styled from "styled-components";
import { MapPinned } from "lucide-react";
import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";

const IconBadge = styled(Box)`
  display: inline-flex;
  padding: 5rem;
  border-radius: 2rem;
  background-color: var(--gray-3);
  color: var(--accent-11);
`;

// oeuf, there are many exit points that may be consolidated:
// permission denied: ok, they denied
// position unavailable: stop being in a tunnel
// timeout: "Geolocation information was not obtained in the allowed time."
export const LocationStep: FC<{
  onAccept: () => unknown;
  onRejected: () => unknown;
  onFailed: () => unknown;
  onGeneralError: (error: GeolocationPositionError) => unknown;
  maxRetries?: number;
}> = ({ onAccept, onFailed, onGeneralError, onRejected, maxRetries = 2 }) => {
  const {
    state: stage,
    isAcquiring,
    requestPermission,
  } = useGeolocationPermission({
    onSuccess: onAccept,
    onFailure: onFailed,
    onError: onGeneralError,
    maxRetries,
  });
  const [url] = useLocationSettingsUrl();

  const explanation = t(
    "Wheelmap needs access to your location in order to show you the closest accessible places. Your location always stays on your device. You may change your decision at any time.",
  );

  const hint = t(
    `If you’re experiencing issues, you may consult [your devices permission configuration](${url}).`,
  );

  return (
    <Box>
      <AlertDialog.Title align="center">
        {t("Enable location permissions")}
      </AlertDialog.Title>
      <Flex justify="center" m="7">
        <IconBadge>
          <MapPinned size={80} color="currentColor" strokeWidth={1} />
        </IconBadge>
      </Flex>

      <AlertDialog.Description>
        <StyledMarkdown align="center">{explanation}</StyledMarkdown>
        {stage.retries > 0 && <StyledMarkdown>{hint}</StyledMarkdown>}
      </AlertDialog.Description>

      <Flex gap="3" mt="4" justify="end">
        <AlertDialog.Action>
          <Button onClick={onRejected} size="3" variant="soft">
            {t("Maybe later")}
          </Button>
        </AlertDialog.Action>
        <AlertDialog.Action>
          <Button
            size="3"
            onClick={requestPermission}
            className={cx("accept", isAcquiring && "active")}
          >
            {t("Access my location")}
            {stage.stage === "acquiring" && <Spinner />}
          </Button>
        </AlertDialog.Action>
      </Flex>
    </Box>
  );
};
