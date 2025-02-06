import {
  AlertDialog,
  Box,
  Button,
  Dialog,
  Flex,
  Spinner,
  VisuallyHidden,
} from "@radix-ui/themes";
import { type FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { t } from "ttag";
import { getLocationSettingsUrl } from "../../lib/goToLocationSettings";
import { cx } from "../../lib/util/cx";
import { CallToActionButton, SecondaryButton } from "../shared/Button";
import StyledMarkdown from "../shared/StyledMarkdown";
import {
  DenyLocationPermissionText,
  GrantLocationPermissionText,
  LocationStepPrimaryText,
} from "./getProductName";

type Stage = "idle" | "acquiring" | "failed-not-exited";

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
  const [stage, setStage] = useState({ stage: "idle" as Stage, retries: 0 });

  useEffect(() => {
    if (!navigator.geolocation) {
      // unsupported feature, default disabled?
      onFailed();
    }
  }, [onFailed]);

  // failing to get the permission puts the UI in a failure state, but does not
  // exit. If the user pressed okay, but then denied from the browser
  // we may as well retry and give enough insights
  const requestLocationPermission = useCallback(() => {
    setStage({ ...stage, stage: "acquiring" });

    navigator.geolocation.getCurrentPosition(onAccept, (error) => {
      if (error.code === error.POSITION_UNAVAILABLE) {
        onAccept();
        return;
      }
      if (
        error.code === error.PERMISSION_DENIED ||
        error.code === error.TIMEOUT
      ) {
        if (stage.retries >= maxRetries) {
          onFailed();
          return;
        }
        setStage({ stage: "failed-not-exited", retries: stage.retries + 1 });
        return;
      }

      onGeneralError(error);
    });
  }, [onAccept, stage, onGeneralError, maxRetries, onFailed]);

  const isAcquiring = stage.stage === "acquiring";
  const [url] = getLocationSettingsUrl();

  // translator: A description that the app is now asking for location permissions while onboarding
  const explanation = t`
    Wheelmap makes more sense if you **allow the app to use your device location**.

    Your location always stays on your device.

    You may change your decision at any time!
  `;

  // translator: A hint that shows up, when acquiring location permissions initially failed
  const hint = t`If you’re experiencing issues, you may consult [your devices permission configuration](${url}).`;

  return (
    <Box>
      <VisuallyHidden>
        <AlertDialog.Title>{t`Enable location permissions`}</AlertDialog.Title>
      </VisuallyHidden>
      <AlertDialog.Description>
        <StyledMarkdown>{explanation}</StyledMarkdown>
        {stage.retries > 0 && <StyledMarkdown>{hint}</StyledMarkdown>}
      </AlertDialog.Description>

      <Flex gap="3" mt="4" justify="end">
        <AlertDialog.Action>
          <Button onClick={onRejected} size="3" variant="soft">
            {t`Skip`}
          </Button>
        </AlertDialog.Action>
        <AlertDialog.Action>
          <Button
            size="3"
            onClick={requestLocationPermission}
            className={cx("accept", isAcquiring && "active")}
          >
            <span className="text">{t`I’m in!`}</span>
            {stage.stage === "acquiring" && <Spinner />}
          </Button>
        </AlertDialog.Action>
      </Flex>
    </Box>
  );
};
