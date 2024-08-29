import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { CallToActionButton } from "../shared/Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .title {
    @media (min-width: 414px) {
      font-size: 1.25rem;
    }
    @media (min-height: 414px) {
      font-size: 1.25rem;
    }
  }

  .details {
    display: flex;
    flex-direction: column;
    > .explainer {
    }
  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > .accept,
    > .deny {
      flex: 1;
    }
  }
`;

type Stage = "idle" | "acquiring" | "failed-not-exited";

// oeuf, there are many exit points that may be consolidated:
// permission denied: ok, they denied
// position unavailable: stop being in a tunnel
// timeout: "Geolocation information was not obtained in the allowed time."
export const LocationStep: FC<{
  onAccept?: () => unknown;
  onRejected?: () => unknown;
  onFailed?: () => unknown;
  onGeneralError?: (error: GeolocationPositionError) => unknown;
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
          onRejected();
          return;
        }
        setStage({ stage: "failed-not-exited", retries: stage.retries + 1 });
        return;
      }

      onGeneralError(error);
    });
  }, [onAccept, stage, setStage, onGeneralError, maxRetries, onRejected]);

  return (
    <Container>
      <header className="title">
        Hold up — we may need your location permissions
      </header>
      <section className="details">
        <p className="explainer">
          Wheelmap is primarily a map app, to orient yourself next to your
          surroundings, we may ask for location permissions of your device. You
          may change your decision at any time!
        </p>
        <p>Your location always stays on your device.</p>
        {stage.retries > 0 && (
          <p>
            If you&apos;re experiencing issues, you may consult your devices
            permission configuration:
            <a href="about:blank">device location permission</a>
          </p>
        )}
      </section>
      <footer className="footer">
        <CallToActionButton onClick={onRejected} className=".deny">
          Continue without location access
        </CallToActionButton>
        <CallToActionButton
          onClick={requestLocationPermission}
          className=".accept"
        >
          I&apos;m in!
        </CallToActionButton>
      </footer>
    </Container>
  );
};
