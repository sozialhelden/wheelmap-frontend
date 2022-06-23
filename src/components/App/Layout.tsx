import React from "react";
import { AppContext } from "../../lib/context/AppContext";
import RoutedMap from "../Map/RoutedMap";
import MapView from "../NewMap/MapView";
import GlobalStyle from "./GlobalAppStyle";
import HeadMetaTags from "./HeadMetaTags";
import MainMenu from "./MainMenu/MainMenu";

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

  const containerRef = React.useRef<HTMLElement>(null);

  return (
    <>
      <HeadMetaTags />

      <GlobalStyle />

      <MainMenu
        onToggle={toggleMainMenu}
        isOpen={isMenuOpen}
        clientSideConfiguration={clientSideConfiguration}
      />

      <main style={{ height: "100%" }} ref={containerRef}>
        <MapView />
        {children}
      </main>
    </>
  );
}
