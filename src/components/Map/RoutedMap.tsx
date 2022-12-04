import { PlaceProperties, EquipmentProperties } from "@sozialhelden/a11yjson";
import { pick } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import useSWR from "swr";
import config from "../../lib/config";
import { AppContext } from "../../lib/context/AppContext";
import { fetchAccessibilityCloudCategories } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import { getAccessibilityFilterFrom } from "../../lib/model/filterAccessibility";
import DynamicMap from "../App/DynamicMap";
import { Cluster } from "./Cluster";
import { MoveArgs } from "./Map";

function getMapPadding({
  hasPanel,
  hasBigViewport,
}: {
  hasPanel: boolean;
  hasBigViewport: boolean;
}) {
  let isPortrait = false;
  if (typeof window !== "undefined") {
    isPortrait = window.innerWidth < window.innerHeight;
  }
  if (hasBigViewport) {
    return { left: hasPanel ? 400 : 32, right: 32, top: 82, bottom: 64 };
  }

  if (isPortrait) {
    return { left: 32, right: 32, top: 82, bottom: hasPanel ? 256 : 64 };
  }
  return { left: hasPanel ? 400 : 32, right: 32, top: 82, bottom: 64 };
}
export default function RoutedMap(props: { hasPanel: boolean }) {
  const app = React.useContext(AppContext);
  const { clientSideConfiguration } = app || {};

  const {
    includeSourceIds,
    excludeSourceIds,
    disableWheelmapSource,
  } = clientSideConfiguration;

  const router = useRouter();
  const { query } = router;
  const {
    lat: latString,
    lon: lonString,
    extent: extentString,
    category,
  } = query;
  const lat = typeof latString === "string" ? parseFloat(latString) : undefined;
  const lon = typeof lonString === "string" ? parseFloat(lonString) : undefined;
  const extent =
    typeof extentString === "string" &&
    (extentString
      .split(",")
      .map(Number.parseFloat)
      .slice(0, 4) as [number, number, number, number]);

  const accessibilityFilter = getAccessibilityFilterFrom(query.wheelchair);
  const toiletFilter = getAccessibilityFilterFrom(query.toilet);
  const { data: categories } = useSWR(
    [app.tokenString],
    fetchAccessibilityCloudCategories
  );
  const categoryId = category;

  const handleMoveEnd = useCallback(({ zoom, lat, lon, bbox }: MoveArgs) => {
    console.log("Handle move end:", { zoom, lat, lon, bbox });
    const url = { query: { lat, lon, zoom } };
    router.push(url, url, { shallow: true });
  }, []);

  const handleMapClick = useCallback(() => {
    console.log("Handle map click");
  }, []);

  const handleClusterClick = useCallback((cluster: Cluster) => {
    console.log("Handle cluster click");
  }, []);

  const handleMappingEventClick = useCallback((eventId: string) => {
    console.log("Handle mapping event click", eventId);
  }, []);

  const handleMarkerClick = useCallback(
    (featureId: string, properties: PlaceProperties | EquipmentProperties) => {
      console.log("Handle map marker click", { featureId, properties });
    },
    []
  );
  return (
    <DynamicMap
      // onError={this.props.onError}
      // activeCluster={this.props.activeCluster}
      // locateOnStart={this.props.shouldLocateOnStart}
      {...{
        ...pick(
          config,
          "maxZoom",
          "defaultStartCenter",
          "minZoomWithSetCategory",
          "minZoomWithoutSetCategory"
        ),
        includeSourceIds,
        excludeSourceIds,
        disableWheelmapSource,
        lat,
        lon,
        extent,
        accessibilityFilter,
        toiletFilter,
        categories,
        categoryId,
        accessibilityCloudAppToken: app.tokenString,
        locateOnStart: false,
        padding: getMapPadding({
          hasPanel: props.hasPanel,
          hasBigViewport: true,
        }),
        hideHints: false,
        inEmbedMode: false,
        onMoveEnd: handleMoveEnd,
        onClick: handleMapClick,
        onClusterClick: handleClusterClick,
        onMarkerClick: handleMarkerClick,
        onMappingEventClick: handleMappingEventClick,
      }}
    />
  );
}
