import * as React from "react";

import { generateMapsUrl } from "../../../lib/model/generateMapsUrls";
import { generateShowOnOsmUrl } from "../../../lib/model/shared/generateOsmUrls";
import { placeNameFor } from "../../../lib/Feature";
import openButtonCaption from "../../../lib/openButtonCaption";
import { Category } from "../../../lib/model/ac/categories/Categories";
import PlaceIcon from "../../icons/actions/Place";
import RouteIcon from "../../icons/actions/Route";

import { UAResult } from "../../../lib/userAgent";
import { PlaceInfo } from "@sozialhelden/a11yjson";
import getAddressString from "../../../lib/model/getAddressString";

type Props = {
  feature: PlaceInfo | null;
  category: Category | null;
  userAgent: UAResult;
};

export default class PlaceAddress extends React.Component<Props, {}> {
  render() {
    const { feature, userAgent } = this.props;

    if (!feature || !feature.properties) return null;

    const placeName = placeNameFor(feature.properties, this.props.category);
    const openInMaps = generateMapsUrl(userAgent, feature, placeName);
    const showOnOsmUrl = generateShowOnOsmUrl(feature);
    const address = getAddressString(feature.properties.address);
    const addressString =
      address && address.replace(/,$/, "").replace(/^,/, "");

    return (
      <React.Fragment>
        {openInMaps && (
          <a className="link-button" href={openInMaps.url}>
            <RouteIcon />
            <span>{addressString || openInMaps.caption}</span>
          </a>
        )}
        {showOnOsmUrl && (
          <a
            className="link-button"
            href={showOnOsmUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PlaceIcon />
            <span>{openButtonCaption("OpenStreetMap")}</span>
          </a>
        )}
      </React.Fragment>
    );
  }
}
