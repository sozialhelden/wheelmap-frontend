import { useEffect } from "react";
import type { AccessibilityCloudRDFId } from "../../../lib/typing/brands/accessibilityCloudIds";
import type { OSMId } from "../../../lib/typing/brands/osmIds";
import { isAccessibilityCloudId } from "../../../lib/typing/discriminators/isAccessibilityCloudId";
import {
  getOSMRDFComponents,
  isOSMId,
} from "../../../lib/typing/discriminators/osmDiscriminator";
import { makeFilterById } from "./filterOperators";
import type { HighlightId } from "./types";
import { useMapFilterContext } from "./useMapFilterContext";

export const useMapHighlight = (featureId: OSMId | AccessibilityCloudRDFId) => {
  const { addFilter, removeById } = useMapFilterContext();

  useEffect(() => {
    let mapFeatureId: string | undefined;

    if (isOSMId(featureId)) {
      const id = getOSMRDFComponents(featureId);
      if (id) {
        mapFeatureId = `${id.properties.element}/${id.properties.value}`;
      }
    }

    if (isAccessibilityCloudId(featureId)) {
      mapFeatureId = featureId.split("/")?.[1];
    }

    const filterId: HighlightId | undefined = mapFeatureId
      ? addFilter(makeFilterById(mapFeatureId)).id
      : undefined;

    return () => {
      if (filterId) {
        removeById(filterId);
      }
    };
  }, [featureId, addFilter, removeById]);
};
