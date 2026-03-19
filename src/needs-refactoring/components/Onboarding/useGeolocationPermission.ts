import { useCallback, useEffect, useState } from "react";

type Stage = "idle" | "acquiring" | "failed-not-exited";

type Options = {
  onSuccess: () => void;
  onFailure: () => void;
  onError: (error: GeolocationPositionError) => void;
  maxRetries?: number;
};

type State = { stage: Stage; retries: number };

// Encapsulates geolocation permission handling for onboarding flow.
export function useGeolocationPermission({
  onSuccess,
  onFailure,
  onError,
  maxRetries = 2,
}: Options) {
  const [state, setState] = useState<State>({ stage: "idle", retries: 0 });

  useEffect(() => {
    if (!navigator.geolocation) {
      onFailure();
    }
  }, [onFailure]);

  const requestPermission = useCallback(() => {
    setState((prev) => ({ ...prev, stage: "acquiring" }));

    navigator.geolocation.getCurrentPosition(
      () => {
        onSuccess();
      },
      (error) => {
        if (error.code === error.POSITION_UNAVAILABLE) {
          onSuccess();
          return;
        }

        if (
          error.code === error.PERMISSION_DENIED ||
          error.code === error.TIMEOUT
        ) {
          setState((prev) => {
            if (prev.retries >= maxRetries) {
              onFailure();
              return prev;
            }
            return { stage: "failed-not-exited", retries: prev.retries + 1 };
          });
          return;
        }

        onError(error);
      },
    );
  }, [maxRetries, onError, onSuccess, onFailure]);

  return {
    state,
    isAcquiring: state.stage === "acquiring",
    requestPermission,
  };
}
