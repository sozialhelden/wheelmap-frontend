import React, { type ReactNode } from "react";
import ToolBar from "~/components/layout/ToolBar";
import { Sidebar } from "~/components/sidebar/Sidebar";
import { getLayout as getMapLayout } from "~/layouts/BaseMapLayout";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { useRenderedFeatures } from "~/modules/map/hooks/useRenderedFeatures";

export function DefaultLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isFilteringActive } = useCategoryFilter();
  const { features, isLoading } = useRenderedFeatures();

  return (
    <>
      <ToolBar />
      {isFilteringActive && (
        <Sidebar isExpanded={true}>
          {!isLoading && <pre>{JSON.stringify(features, null, 2)}</pre>}
        </Sidebar>
      )}
      {children}
    </>
  );
}

export const getLayout = (page: ReactNode) =>
  getMapLayout(<DefaultLayout>{page}</DefaultLayout>);
