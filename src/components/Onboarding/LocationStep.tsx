import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { cx } from "../../lib/util/cx";
import { CallToActionButton, SecondaryButton } from "../shared/Button";
import StyledMarkdown from "../shared/StyledMarkdown";
import {
  DenyLocationPermissionText,
  GrantLocationPermissionText,
  LocationStepAdditionalHint,
  LocationStepPrimaryText,
} from "./language";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  h1 {
    @media (min-width: 414px) {
      font-size: 1.25rem;
    }
    @media (min-height: 414px) {
      font-size: 1.25rem;
    }
  }

  > * {
    max-width: 400px;
  }

  .footer {
    max-width: 400px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-self: center;
    gap: 24px;

    > .accept {
      flex: 0;
      display: flex;
      gap: 10px;
      min-width: fit-content;
      justify-items: center;
      align-items: center;
      padding: 0 24px;

      > .text {
        transition: 0.25s transform ease;
        transform: translateX(12px);
      }

      &.active {
        > .text {
          transform: translateX(0);
        }

        > .loader {
          opacity: 1;
        }
      }

      > .loader {
        width: 22px;
        height: 22px;
        border: 3px solid #fff;
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        transition: 0.25s opacity ease;
        opacity: 0;
      }
    }
    > .deny {
      flex: 1;
    }

    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;

const ReducedSecondaryButton = styled(SecondaryButton)`
  // width is 100%
  width: auto;
  // conforms more with the call to action button
  padding: 0.5em 0.75em;
  border-radius: 0.5rem;
`;

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
  }, [onAccept, stage, setStage, onGeneralError, maxRetries, onFailed]);

  const isAcquiring = stage.stage === "acquiring";

  // when retries fail, show an additional hint
  const primaryText = `${LocationStepPrimaryText}${
    stage.retries > 0 ? `\n\n${LocationStepAdditionalHint("about:blank")}` : ""
  }`;

  return (
    <Container>
      <StyledMarkdown>{primaryText}</StyledMarkdown>

      <footer className="footer">
        <ReducedSecondaryButton onClick={onRejected} className="deny">
          {DenyLocationPermissionText}
        </ReducedSecondaryButton>
        <CallToActionButton
          onClick={requestLocationPermission}
          className={cx("accept", isAcquiring && "active")}
        >
          <span className="text">{GrantLocationPermissionText}</span>
          <span className="loader" />
        </CallToActionButton>
      </footer>
    </Container>
  );
};
