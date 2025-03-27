import { t } from "@transifex/native";
import * as React from "react";
import { toast } from "react-toastify";
import { SWRConfig, type SWRConfiguration } from "swr";
import { ErrorMessage } from "~/needs-refactoring/components/SWRError/ErrorMessage";
import type ResourceError from "~/needs-refactoring/lib/fetchers/ResourceError";

const globalSWRConfig: SWRConfiguration<unknown, ResourceError> = {
  onError: (error, key) => {
    const toastId = key;
    if (error) {
      console.error("SWR error", error);
      const errorElement = <ErrorMessage error={error} />;
      toast.error(errorElement, {
        toastId,
        delay: 2000,
        autoClose: false,
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  },
  onLoadingSlow(key, config) {
    toast.warn(
      t("Loading seems to take a bit longer than usual. Please hold the line…"),
      {
        toastId: key,
        delay: 2000,
        autoClose: false,
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      },
    );
  },
  onSuccess(data, key, config) {
    toast.dismiss(key);
  },
};

export default function SWRConfigProvider({ children }) {
  return <SWRConfig value={globalSWRConfig}>{children}</SWRConfig>;
}
