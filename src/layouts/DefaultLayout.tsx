import type { GeoJSONFeature } from "mapbox-gl";
import React, { useState, type ReactNode, useMemo } from "react";
import ToolBar from "~/components/layout/ToolBar";
import { Sheet } from "~/components/sheet/Sheet";
import { Sidebar } from "~/components/sidebar/Sidebar";
import { useBreakpoints } from "~/hooks/useBreakpoints";
import { getLayout as getMapLayout } from "~/layouts/BaseMapLayout";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { List } from "~/modules/list/components/List";

export type RenderedFeature = GeoJSONFeature & {
  _id?: string;
  "@type"?: string;
};

export function DefaultLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { greaterOrEqual } = useBreakpoints();
  const showSidebar = greaterOrEqual("sm");

  const [isExpanded, setIsExpanded] = useState(true);

  const { isFilteringActive } = useCategoryFilter();

  return (
    <>
      <ToolBar />
      {isFilteringActive &&
        (showSidebar ? (
          <Sidebar isExpanded={isExpanded} onIsExpandedChange={setIsExpanded}>
            <List />
          </Sidebar>
        ) : (
          <Sheet
            isExpanded={isExpanded}
            onIsExpandedChanged={setIsExpanded}
            scrollStops={[0, 0.5]}
          >
            <List />
          </Sheet>
        ))}
      {children}
    </>
  );
}

export const getLayout = (page: ReactNode) =>
  getMapLayout(<DefaultLayout>{page}</DefaultLayout>);
