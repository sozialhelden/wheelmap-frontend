import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { cx } from "../../lib/util/cx";
import { CallToActionButton, SecondaryButton } from "../shared/Button";

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
          onRejected();
          return;
        }
        setStage({ stage: "failed-not-exited", retries: stage.retries + 1 });
        return;
      }

      onGeneralError(error);
    });
  }, [onAccept, stage, setStage, onGeneralError, maxRetries, onRejected]);

  const isAcquiring = stage.stage === "acquiring";

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
            If you&apos;re experiencing issues, you may consult{" "}
            <a href="about:blank">your devices permission configuration</a>
          </p>
        )}
      </section>
      <footer className="footer">
        <ReducedSecondaryButton onClick={onRejected} className="deny">
          Continue without location access
        </ReducedSecondaryButton>
        <CallToActionButton
          onClick={requestLocationPermission}
          className={cx("accept", isAcquiring && "active")}
        >
          <span className="text">I&apos;m in!</span>
          <span className="loader" />
        </CallToActionButton>
      </footer>
    </Container>
  );
};
