import type { BackgroundLayout } from "mapbox-gl";
import type { FC } from "react";
import { Layer, type LayerProps } from "react-map-gl/mapbox";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { filterForLayer, useMapFilterContext } from "./filter";

/**
 * If there are no filters passed as argument, a filter expression will be built from the map filter context
 */
export const MapLayer: FC<LayerProps & { asFilterLayer?: boolean }> = ({
  asFilterLayer,
  ...props
}) => {
  const { filter: mapFilters } = useMapFilterContext();
  const { isFilteringActive } = useCategoryFilter();

  // if (isFilteringActive && props.id !== "osm-wheelchair-yes-label") {
  //   return null;
  // }

  if (asFilterLayer) {
    const builtFilters = filterForLayer(props.id, mapFilters);
    if (!builtFilters) {
      return null;
    }
    const combinedFilters = [
      "all",
      filterForLayer(props.id, mapFilters),
      ...(props.filter?.[0] === "all" ? props.filter.slice(1) : [props.filter]),
    ].filter(Boolean);

    const layout: BackgroundLayout = { ...props.layout, visibility: "visible" };

    return (
      <Layer {...props} filter={combinedFilters} minzoom={0} layout={layout} />
    );
  }

  return <Layer {...props} />;
};
