import { Callout, Card, H2, UL } from "@blueprintjs/core";
import { LIST_UNSTYLED } from "@blueprintjs/core/lib/esm/common/classes";
import { difference } from "lodash";
import React from "react";
import useSWR from "swr";
import ExternalFeatureLink from "./IconButtonList/ExternalFeatureLink";
import FeatureAddress, { addressForFeature } from "./FeatureAddressString";
import OSMTagTable from "./AccessibilitySection/OSMTagTable";
import FeatureContext from "./FeatureContext";
import { OSMFeatureId, OSMFeatureOrError, OSMAPIErrorResponse, isErrorResponse } from "../../../lib/model/osm/OSMFeature";
import { TypeTaggedOSMFeatureOrError } from "../../../lib/model/shared/AnyFeature";
import getFeatureDisplayName from "../../../lib/model/osm/getFeatureDisplayName";
import getFeatureCategoryDisplayName from "../../../lib/model/osm/getFeatureCategoryDisplayName";
import isAccessibilityRelevantOSMKey from "../../../lib/model/osm/isAccessibilityRelevantOSMKey";
import isAddressRelevantOSMKey from "../../../lib/model/osm/isAddressRelevantOSMKey";
import { translatedStringFromObject } from "../../../lib/i18n/translatedStringFromObject";
import FeatureImage from "./image/FeatureImage";
import PlaceWheelchairAndToiletAccessibilitySection from "./AccessibilitySection/tags/PlaceToiletAccessibility";

type Props = {
  featureId: OSMFeatureId;
};

const fetcher = (input: RequestInfo, init?: RequestInit | undefined) =>
  fetch(input, init)
    .then((res) => res.json())
    .then((json) => {
      if (isErrorResponse(json)) {
        return json;
      }
      return {
        ...json,
        '@type': 'osm:Feature'
      };
    });

function Skeleton() {
  return <div className="bp3-skeleton">Loading...</div>;
}

const omittedKeyPrefixes = ["type", "name", "area", "opening_hours"];

export default function FeatureDetails(props: Props) {
  const { featureId } = props;
  const url = `${process.env.REACT_APP_OSM_API_BACKEND_URL}/${featureId.source}/${featureId.id}.json`;

  const { data: osmFeatureOrError, error } = useSWR<TypeTaggedOSMFeatureOrError, OSMAPIErrorResponse>(
    url,
    fetcher
  );

  if (error) return <Callout intent="danger">{JSON.stringify(error)}</Callout>;

  if (!osmFeatureOrError) return <Skeleton />;

  if (isErrorResponse(osmFeatureOrError)) {
    return <Callout intent="danger">{JSON.stringify(osmFeatureOrError)}</Callout>;
  }

  const sortedKeys = Object.keys(osmFeatureOrError.properties)
    .sort()
    .sort((a, b) => {
      if (a.startsWith("name")) return -1;
      if (b.startsWith("name")) return 1;
      return 0;
    });

  const filteredKeys = sortedKeys.filter(
    (key) => !omittedKeyPrefixes.find((prefix) => key.startsWith(prefix))
  );
  const accessibilityRelevantKeys = filteredKeys.filter(
    isAccessibilityRelevantOSMKey
  );

  const addressRelevantKeys = filteredKeys.filter(isAddressRelevantOSMKey);

  const remainingKeys = difference(
    filteredKeys,
    accessibilityRelevantKeys,
    addressRelevantKeys
  );

  const geometryType = osmFeatureOrError.geometry.type;
  const osmType =
    geometryType === "Point"
      ? "node"
      : osmFeatureOrError._id.startsWith("-")
      ? "relation"
      : "way";
  const osmId = osmFeatureOrError._id.replace(/^-/, "");
  const displayName = translatedStringFromObject(getFeatureDisplayName(osmFeatureOrError));
  const categoryName = getFeatureCategoryDisplayName(osmFeatureOrError);
  const address = addressForFeature(osmFeatureOrError);

  return (
    <FeatureContext.Provider value={osmFeatureOrError.error ? undefined : osmFeatureOrError}>
      <Card style={{ gap: "10px", maxWidth: "40rem" }}>
        <header
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>
            <H2>{displayName || categoryName}</H2>
            {/* If there is no display name, the category name is already displayed above */}
            {displayName && categoryName && (
              <p style={{ fontWeight: "bold" }}>{categoryName}</p>
            )}
            {osmFeatureOrError.properties.description && <p>{osmFeatureOrError.properties.description}</p>}
            <FeatureAddress address={address} />
          </div>
          <FeatureImage feature={osmFeatureOrError} />
        </header>

        <OSMTagTable nestedTags={accessibilityRelevantKeys} feature={osmFeatureOrError} />

        <details>
          <summary>See OpenStreetMap information</summary>
          <h3>OSM tags</h3>
          <OSMTagTable nestedTags={remainingKeys} feature={osmFeatureOrError} />
          <UL className={LIST_UNSTYLED}>
            <ExternalFeatureLink
              href={`https://openstreetmap.org/${osmType}/${osmId}`}
            >
              Open on OpenStreetMap
            </ExternalFeatureLink>

            {osmType !== "relation" && (
              <ExternalFeatureLink
                href={`https://wheelmap.org/nodes/${
                  osmType === "way" ? "-" : ""
                }${osmId}`}
              >
                Open on Wheelmap
              </ExternalFeatureLink>
            )}

            <ExternalFeatureLink
              href={`https://www.openstreetmap.org/edit?${osmType}=${osmId}#map=19/${osmFeatureOrError.centroid.coordinates[1]}/${osmFeatureOrError.centroid.coordinates[0]}`}
            >
              Edit with ID Editor
            </ExternalFeatureLink>

            <ExternalFeatureLink
              href={`${process.env.REACT_APP_OSM_API_BACKEND_URL}/${featureId.source}/${featureId.id}.geojson`}
            >
              Show GeoJSON
            </ExternalFeatureLink>
          </UL>
        </details>
      </Card>
    </FeatureContext.Provider>
  );
}
