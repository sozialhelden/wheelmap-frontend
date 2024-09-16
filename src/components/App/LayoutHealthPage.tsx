import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "normalize.css";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import WindowContextProvider from "../../lib/context/WindowContext";
import GlobalStyle from "./GlobalAppStyle";
import HeadMetaTags from "./HeadMetaTags";

export default function LayoutHealthPage({ children, blur }: { children?: React.ReactNode; blur?: boolean }) {
  const containerRef = React.useRef<HTMLElement>(null);

  return (
    <>
      <HeadMetaTags />

      <GlobalStyle />

      <main style={{ height: "100vh" }} ref={containerRef}>
        <WindowContextProvider>
          <div
            style={{
              zIndex: 2000,
            }}
          >
            {children}
          </div>
        </WindowContextProvider>
      </main>
    </>
  );
}
