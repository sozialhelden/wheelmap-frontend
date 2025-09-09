"use client";

import React, { type ReactNode } from "react";
import styled from "styled-components";
import ToolBar from "~/app/(app)/(map)/_components/ToolBar";
import { CategoryFilterContextProvider } from "~/modules/categories/hooks/useCategoryFilter";
import MapComponent from "~/modules/map/components/MapComponent";
import { MapHighlightContextProvider } from "~/modules/map/hooks/useHighlight";
import { MapContextProvider } from "~/modules/map/hooks/useMap";
import { MapRenderedFeaturesContextProvider } from "~/modules/map/hooks/useRenderedFeatures";

const Container = styled.div`
  position: relative;
  height: 100%;
`;
const Main = styled.main`
  z-index: 2000;
`;

/**
 * Main layout that includes the map.
 */
export default function MapLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MapContextProvider>
        <MapHighlightContextProvider>
          <MapRenderedFeaturesContextProvider>
            <CategoryFilterContextProvider>
              <Container>
                <Main>{children}</Main>
                <MapComponent />
              </Container>
            </CategoryFilterContextProvider>
          </MapRenderedFeaturesContextProvider>
        </MapHighlightContextProvider>
      </MapContextProvider>
    </>
  );
}
