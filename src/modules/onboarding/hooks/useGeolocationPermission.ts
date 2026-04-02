import { useCallback, useEffect, useState } from "react";

type Stage = "idle" | "acquiring";

type Options = {
  onSuccess: (position: GeolocationPosition) => void;
  onUnavailable: () => void;
  onReject: () => void;
  onError: (error: GeolocationPositionError) => void;
  onFailure: () => void;
};

type State = { stage: Stage };

export function useGeolocationPermission({
  onSuccess,
  onUnavailable,
  onReject,
  onError,
  onFailure,
}: Options) {
  const [state, setState] = useState<State>({ stage: "idle" });

  useEffect(() => {
    if (!navigator.geolocation) {
      onFailure();
    }
  }, [onFailure]);

  const requestPermission = useCallback(() => {
    setState({ stage: "acquiring" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSuccess(position);
      },
      (error) => {
        setState({ stage: "idle" });

        if (error.code === error.PERMISSION_DENIED) {
          onReject();
          return;
        }

        if (
          error.code === error.POSITION_UNAVAILABLE ||
          error.code === error.TIMEOUT
        ) {
          onUnavailable();
          return;
        }

        onError(error);
      },
    );
  }, [onError, onReject, onSuccess, onUnavailable]);

  return {
    state,
    isAcquiring: state.stage === "acquiring",
    requestPermission,
  };
}
