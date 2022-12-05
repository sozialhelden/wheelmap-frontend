import { Callout, Card, H2, UL } from "@blueprintjs/core";
import { LIST_UNSTYLED } from "@blueprintjs/core/lib/esm/common/classes";
import { difference } from "lodash";
import React from "react";
import useSWR from "swr";

import ExternalFeatureLink from "./IconButtonList/ExternalFeatureLink";
import FeatureAddress from "./FeatureAddressString";
import FeatureImage from "./FeatureImage";
import isAddressRelevantOSMKey from "../../lib/model/osm/isAddressRelevantOSMKey";
import OSMTagTable from "./OSMTagTable";
import getFeatureCategoryDisplayName from "../../lib/model/osm/getFeatureCategoryDisplayName";
import getFeatureDisplayName from "../../lib/model/osm/getFeatureDisplayName";
import isAccessibilityRelevantOSMKey from "../../lib/model/osm/isAccessibilityRelevantOSMKey";
import {
  OSMFeatureId,
  OSMFeatureOrError,
  OSMAPIErrorResponse,
  isErrorResponse,
} from "../../lib/model/osm/OSMFeature";

type Props = {
  featureId: OSMFeatureId;
};

const fetcher = (input: RequestInfo, init?: RequestInit | undefined) =>
  fetch(input, init).then((res) => res.json());

function Skeleton() {
  return <div className="bp3-skeleton">Loading...</div>;
}

const omittedKeyPrefixes = ["type", "name", "area"];

export default function FeatureDetails(props: Props) {
  const { featureId } = props;
  const url = `${process.env.REACT_APP_OSM_API_BACKEND_URL}/${featureId.source}/${featureId.id}.json`;

  const { data, error } = useSWR<OSMFeatureOrError, OSMAPIErrorResponse>(
    url,
    fetcher
  );

  if (error) return <Callout intent="danger">{JSON.stringify(error)}</Callout>;

  if (!data) return <Skeleton />;

  if (isErrorResponse(data)) {
    return <Callout intent="danger">{JSON.stringify(data)}</Callout>;
  }

  const sortedKeys = Object.keys(data.properties)
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

  const geometryType = data.geometry.type;
  const osmType =
    geometryType === "Point"
      ? "node"
      : data._id.startsWith("-")
      ? "relation"
      : "way";
  const osmId = data._id.replace(/^-/, "");
  const displayName = getFeatureDisplayName(data);
  const categoryName = getFeatureCategoryDisplayName(data);

  return (
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
          {data.properties.description && <p>{data.properties.description}</p>}
          <FeatureAddress feature={data} />
        </div>
        <FeatureImage feature={data} />
      </header>

      <OSMTagTable keys={accessibilityRelevantKeys} feature={data} />

      <details>
        <summary>See OpenStreetMap information</summary>
        <h3>OSM tags</h3>
        <OSMTagTable keys={remainingKeys} feature={data} />
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
            href={`https://www.openstreetmap.org/edit?${osmType}=${osmId}#map=19/${data.centroid.coordinates[1]}/${data.centroid.coordinates[0]}`}
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
  );
}
