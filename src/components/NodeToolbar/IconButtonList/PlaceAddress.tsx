import * as React from "react";
import useSWR from "swr";
import AppContext from "../../../AppContext";
import { Category } from "../../../lib/Categories";
import { AccessibilityCloudProperties, Feature, NodeProperties, isWheelmapProperties, placeNameFor } from "../../../lib/Feature";
import { generateMapsUrl } from "../../../lib/generateMapsUrls";
import { generateShowOnOsmUrl } from "../../../lib/generateOsmUrls";
import getAddressString from "../../../lib/getAddressString";
import getAddressStringFromA11yJSONFeature from "../../../lib/getAddressStringFromA11yJSONFeature";
import openButtonCaption from "../../../lib/openButtonCaption";
import { UAResult } from "../../../lib/userAgent";
import { fetchJSON, generateGetPlaceInfoURL } from "../../helper";
import PlaceIcon from "../../icons/actions/Place";
import RouteIcon from "../../icons/actions/Route";

function useParentPlaceInfo(parentPlaceInfoId: string) {
  const appContext = React.useContext(AppContext);
  const baseUrl = generateGetPlaceInfoURL({
    baseUrl: appContext.baseUrl,
    placeInfoId: parentPlaceInfoId,
    appToken: appContext.app.tokenString,
  });
  const { data, error } = useSWR<any>(baseUrl, fetchJSON);
  return { data, error };
}

function getAddressForACProperties(properties: AccessibilityCloudProperties): string | null {
  if (typeof properties.address === "string") return properties.address;
  if (typeof properties.address === "object") {
    switch (true) {
      case typeof properties.address.full === "string":
        return properties.address.full;
      case typeof properties.address.text === "string":
        return properties.address.text;
      case typeof properties.address.full !== "string" || typeof properties.address.text !== "string":
        return getAddressStringFromA11yJSONFeature(properties.address);
      default:
        return null;
    }
  }
  return null;
}

function useAddressForProperties(properties: NodeProperties): string | null {
  if ((properties as any)?.parentPlaceInfo) {
    const parentPlaceInfo = useParentPlaceInfo((properties as any)?.parentPlaceInfo);
    // Use parentPlaceInfo to get the address, if necessary
    console.log("data: " + parentPlaceInfo.data);
    console.log("error: " + parentPlaceInfo.error);
    // return getAddressForACProperties(properties);
  }
  if (!isWheelmapProperties(properties)) {
    return getAddressForACProperties(properties);
  }
  return getAddressString(properties);
}

type Props = {
  feature: Feature | null;
  category: Category | null;
  userAgent: UAResult;
};

const PlaceAddress: React.FC<Props> = ({ feature, category, userAgent }) => {
  const placeName = placeNameFor(feature.properties, category);
  const openInMaps = generateMapsUrl(userAgent, feature, placeName);
  const showOnOsmUrl = generateShowOnOsmUrl(feature);
  const address = useAddressForProperties(feature.properties);

  if (!feature || !feature.properties) return null;
  const addressString = address && address.replace(/,$/, "").replace(/^,/, "");

  return (
    <React.Fragment>
      {openInMaps && (
        <a className="link-button" href={openInMaps.url}>
          <RouteIcon />
          <span>{addressString || openInMaps.caption}</span>
        </a>
      )}
      {showOnOsmUrl && (
        <a className="link-button" href={showOnOsmUrl} target="_blank" rel="noopener noreferrer">
          <PlaceIcon />
          <span>{openButtonCaption("OpenStreetMap")}</span>
        </a>
      )}
    </React.Fragment>
  );
};

export default PlaceAddress;
