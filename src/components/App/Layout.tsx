import React from "react";
import styled from "styled-components";
import { AppContext } from "../../lib/context/AppContext";
import MapView from "../MapNew/MapView";
import GlobalStyle from "./GlobalAppStyle";
import HeadMetaTags from "./HeadMetaTags";
import MainMenu from "./MainMenu/MainMenu";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

const BlurLayer = styled.div<{ active: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(${(p) => (p.active ? "10" : "0")}px);
  pointer-events: ${(p) => (p.active ? "initial" : "none")};
`;

export default function Layout({
  children,
  blur,
}: {
  children?: React.ReactNode;
  blur?: boolean;
}) {
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

      {!blur && (
        <MainMenu
          onToggle={toggleMainMenu}
          isOpen={isMenuOpen}
          clientSideConfiguration={clientSideConfiguration}
        />
      )}

      <main style={{ height: "100%" }} ref={containerRef}>
        <MapView {...{ containerRef }} />
        <BlurLayer active={blur} style={{ zIndex: 1000 }} />
        <div style={{ zIndex: 2000 }}>{children}</div>
        <ToastContainer position="bottom-center" />
      </main>
    </>
  );
}
