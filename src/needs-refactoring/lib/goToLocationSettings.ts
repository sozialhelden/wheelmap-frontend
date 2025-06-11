import { t } from "@transifex/native";
import { useUserAgent } from "~/hooks/useUserAgent";
import { saveState } from "./util/savedState";

const alertText = t(
  "To locate yourself on the map, open browser settings and allow Wheelmap.org to use location services.",
);

/**
 * Get the URL to the devices location settings.
 * Returns if `isSupportUrl` the devices support page on, otherwise an js-href link to show an alert box
 *
 * @returns [locationUri, isSupportUrl]
 */
export function useLocationSettingsUrl(): [string, boolean] {
  const { userAgent } = useUserAgent();

  // @ts-ignore
  let identity = userAgent.browser.name;
  if (userAgent?.os.name === "iOS") {
    identity = "iOS";
  } else if (userAgent?.os.name === "Android") {
    identity = "Android";
  }

  const supportURLs = {
    Safari: "https://support.apple.com/en-us/ht204690",
    "Mobile Safari": "https://support.apple.com/en-us/ht203033",
    iOS: "https://support.apple.com/en-us/ht203033",
    Android: "https://support.google.com/android/answer/6179507",
    Chrome: "https://support.google.com/chrome/answer/142065",
    Firefox:
      "https://support.mozilla.org/en-US/kb/does-firefox-share-my-location-websites",
    Edge: "http://www.monitorconnect.com/allow-location-tracking-on-microsoft-edge-web-solution-b/",
  };

  if (identity in supportURLs) {
    return [supportURLs[identity], true] as const;
  }
  // poor but effective: when using a markdown renderer, this works reasonably well with prior behavior
  return [encodeURI(`javascript:window.alert(${alertText})`), false];
}

/** Open location settings or show the user how to open them */
export default function goToLocationSettings() {
  saveState({ hasOpenedLocationHelp: "true" });
  const [url, isSupportUrl] = useLocationSettingsUrl();

  if (isSupportUrl) {
    window.open(url, "_blank");
    return;
  }

  window.alert(alertText);
}
