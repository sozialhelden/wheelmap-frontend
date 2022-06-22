import React, { useCallback } from "react";
import { AppContext } from "../../lib/context/AppContext";
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
