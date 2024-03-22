import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import { useRouter } from "next/router";
import "normalize.css";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { AppContext } from "../../lib/context/AppContext";
import WindowContextProvider from "../../lib/context/WindowContext";
import GlobalStyle from "./GlobalAppStyle";
import HeadMetaTags from "./HeadMetaTags";
import MainMenu from "./MainMenu/MainMenu";

const BlurLayer = styled.div<{ active: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(${(p) => (p.active ? "10" : "0")}px);
  pointer-events: ${(p) => (p.active ? "initial" : "none")};
`;

export default function LayoutHealthPage({
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
  const toggleMainMenu = React.useCallback((newValue?: boolean) => {
    setIsMenuOpen(typeof newValue === 'boolean' ? newValue : !isMenuOpen);
  }, [isMenuOpen]);

  const containerRef = React.useRef<HTMLElement>(null);

  const router = useRouter();
  const { pathname } = router;
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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

      <main 
        style={{ height: "100vh" }} 
        ref={containerRef} 
      >
        {/* <BlurLayer active={blur} style={{ zIndex: 1000 }} /> */}
        <WindowContextProvider>
          <div style={{ 
            zIndex: 2000
          }}>
            {children}
            </div>
          {/* <ToastContainer position="bottom-center" /> */}
        </WindowContextProvider>
      </main>
    </>
  );
}
