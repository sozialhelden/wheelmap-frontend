import { t } from "@transifex/native";
import * as React from "react";
import { toast } from "react-toastify";
import { SWRConfig, type SWRConfiguration } from "swr";
import type ResourceError from "~/lib/fetchers/ResourceError";

const globalSWRConfig: SWRConfiguration<unknown, ResourceError> = {
  onError: (error, key) => {
    if (error) {
      console.error("SWR error", error);
    }
  },
  onLoadingSlow(key, config) {
    toast.warn(
      t("Loading seems to take a bit longer than usual. Please hold the line…"),
      {
        toastId: key,
        delay: 1500,
        autoClose: 5000,
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
