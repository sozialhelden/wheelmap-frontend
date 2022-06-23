import { pick } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import config from "../../lib/config";
import { AppContext, useCurrentApp } from "../../lib/context/AppContext";
import { getAccessibilityFilterFrom } from "../../lib/model/filterAccessibility";
import { isOnSmallViewport } from "../../lib/ViewportSize";
import Map from "../Map/Map";
import DynamicMap from "./DynamicMap";
import GlobalStyle from "./GlobalAppStyle";
import HeadMetaTags from "./HeadMetaTags";
import MainMenu from "./MainMenu/MainMenu";

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

export default function Layout({ children }: { children?: React.ReactNode }) {
  // const { data, error } = useSWR('/api/navigation', fetcher)

  // if (error) return <div>Failed to load</div>
  // if (!data) return <div>Loading...</div>

  const app = React.useContext(AppContext);
  const { clientSideConfiguration } = app || {};

  const {
    includeSourceIds,
    excludeSourceIds,
    disableWheelmapSource,
  } = clientSideConfiguration;

  const router = useRouter();
  const { query } = router;
  const { lat: latString, lon: lonString, extent: extentString } = query;
  const lat = typeof latString === "string" ? parseFloat(latString) : undefined;
  const lon = typeof lonString === "string" ? parseFloat(lonString) : undefined;
  const extent =
    typeof extentString === "string" &&
    (extentString
      .split(",")
      .map(Number.parseFloat)
      .slice(0, 4) as [number, number, number, number]);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMainMenu = React.useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const handleMoveEnd = useCallback(() => {
    console.log("Handle move end:", arguments);
  }, []);

  const handleMapClick = useCallback(() => {
    console.log("Handle map click:", arguments);
  }, []);

  const accessibilityFilter = getAccessibilityFilterFrom(query.wheelchair);
  const toiletFilter = getAccessibilityFilterFrom(query.toilet);

  return (
    <>
      <HeadMetaTags />

      <GlobalStyle />

      <MainMenu
        onToggle={toggleMainMenu}
        isOpen={isMenuOpen}
        clientSideConfiguration={clientSideConfiguration}
      />

      <main>
        <DynamicMap
          // onMoveEnd={this.props.onMoveEnd}
          // onClick={this.props.onMapClick}
          // onMarkerClick={this.props.onMarkerClick}
          // onClusterClick={this.props.onClusterClick}
          // onMappingEventClick={this.props.onMappingEventClick}
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
          }}
          locateOnStart={false}
          padding={getMapPadding({
            hasPanel: !!children,
            hasBigViewport: true,
          })}
          hideHints={
            // isOnSmallViewport() && (children || isMenuOpen)
            false
          }
          inEmbedMode={false}
        />
        {children}
      </main>
    </>
  );
}
