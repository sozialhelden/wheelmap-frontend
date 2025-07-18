import { Spinner } from "@radix-ui/themes";
import { t } from "@transifex/native";
import React, {
  createContext,
  type FC,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
} from "react";
import styled from "styled-components";
import { useAppStateAwareRouter } from "~/modules/app-state/hooks/useAppStateAwareRouter";
import { useHighlight } from "~/modules/map/hooks/useHighlight";
import { useExpandedFeatures } from "~/needs-refactoring/lib/fetchers/useFeatures";
import {
  type CollectedFeature,
  collectExpandedFeaturesResult,
} from "~/needs-refactoring/lib/fetchers/useFeatures/collectExpandedFeatures";
import { rolloutOsmFeatureIds } from "~/needs-refactoring/lib/model/osm/rolloutOsmFeatureIds";
import { isAccessibilityCloudId } from "~/needs-refactoring/lib/typing/discriminators/isAccessibilityCloudId";
import {
  isOSMElementValue_Legacy,
  isOSMId,
  isOSMIdWithTableAndContextName,
  isOSMIdWithTypeAndTableName,
  isOSMTypedId,
} from "~/needs-refactoring/lib/typing/discriminators/osmDiscriminator";
import { normalizeAccessibilityCloudId } from "~/needs-refactoring/lib/typing/normalization/accessibilityCloudIdNormalization";
import { normalizeOSMId } from "~/needs-refactoring/lib/typing/normalization/osmIdNormalization";

interface FeaturePanelContextType {
  features: {
    id: string;
    feature?: CollectedFeature;
  }[];
  anyLoading: boolean;
  firstError?: unknown;
  baseFeatureUrl: string;
}

export const FeaturePanelContext = createContext<FeaturePanelContextType>({
  features: [],
  anyLoading: false,
  firstError: false,
  baseFeatureUrl: "",
});

const allowedPlaceTypes = [
  // outdated
  "composite",
  "entrances_or_exits",
  "buildings",
  "amenities",
  "pedestrian_highways",
  // osm-style
  "node",
  "way",
  "relation",
  // rdf style
  "ac:PlaceInfo",
  "ac:EquipmentInfo",
] as const;

type AllowedPlaceType = (typeof allowedPlaceTypes)[number];

function isAllowedPlaceType(placeType: string): placeType is AllowedPlaceType {
  // biome-ignore lint/suspicious/noExplicitAny: any usage is okay in a type guard
  return allowedPlaceTypes.includes(placeType as any);
}

function buildFeatureIds(placeType: string, ids: string[]) {
  if (!isAllowedPlaceType(placeType)) {
    throw new Error(`Invalid or unknown placeType: ${placeType}`);
  }

  if (placeType === "composite") {
    return ids;
  }

  if (placeType === "way" || placeType === "relation" || placeType === "node") {
    return rolloutOsmFeatureIds(placeType, ids);
  }

  return ids.map((id) => `${placeType}/${id}`);
}

export const ErrorToolBar: FC = () => {
  const ref = useRef(null);
  return (
    <p className="_title" ref={ref}>
      Something did not work right
    </p>
  );
};

const StyledLoadingDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
`;

const normalizeIds = (ids: string[]) =>
  ids
    .flatMap((x) => {
      if (isOSMId(x)) {
        if (isOSMTypedId(x)) {
          return [
            normalizeOSMId(x, "amenities"),
            normalizeOSMId(x, "buildings"),
          ];
        }
        if (isOSMElementValue_Legacy(x)) {
          return [
            normalizeOSMId(x, "amenities"),
            normalizeOSMId(x, "buildings"),
          ];
        }
        if (isOSMIdWithTypeAndTableName(x)) {
          return normalizeOSMId(x);
        }
        if (isOSMIdWithTableAndContextName(x)) {
          return normalizeOSMId(x);
        }
        return normalizeOSMId(x);
      }

      if (isAccessibilityCloudId(x)) {
        return normalizeAccessibilityCloudId(x);
      }
      console.warn(`FeatureID could not be categorized, was: '${x}'`);
      return undefined;
    })
    .filter((x) => !!x);

export function FeaturePanelContextProvider({
  featureIds: passedFeatureIds,
  children,
}: {
  featureIds?: string[];
  children: ReactNode;
}) {
  const {
    query: { placeType, id: idOrIds },
  } = useAppStateAwareRouter();
  const baseFeatureUrl = `/${placeType}/${idOrIds}`;

  const ids = useMemo(
    () => (Array.isArray(idOrIds) ? idOrIds : (idOrIds?.split(",") ?? [])),
    [idOrIds],
  );
  const featureIds =
    passedFeatureIds ?? buildFeatureIds(String(placeType), ids);

  const normalizedIds = normalizeIds(featureIds);

  const expandedFeatures = useExpandedFeatures(normalizedIds, {
    useFeaturesSWRConfig: { shouldRetryOnError: false },
    useOsmToAcSWRConfig: { shouldRetryOnError: false },
  });
  const { isLoading, isValidating } = expandedFeatures;

  const resultSet = collectExpandedFeaturesResult(
    normalizedIds,
    expandedFeatures,
  );
  const anyLoading = isLoading || isValidating;
  // eslint-disable-next-line max-len, @stylistic/js/max-len
  const firstError =
    expandedFeatures.requestedFeatures.error ??
    expandedFeatures.additionalAcFeatures.error ??
    expandedFeatures.additionalOsmFeatures.error;
  const contextValue = useMemo(
    () =>
      ({
        features: resultSet.features.map((x, i) => ({
          id: normalizeIds[i],
          feature: x,
        })),
        anyLoading,
        firstError,
        baseFeatureUrl,
      }) satisfies FeaturePanelContextType,
    [firstError, anyLoading, baseFeatureUrl, resultSet.features],
  );
  const { highlight, removeHighlight } = useHighlight();

  const id = resultSet?.features?.[0]?.requestedFeature._id;

  useEffect(() => {
    if (id) highlight(id);
    return () => {
      if (id) removeHighlight(id);
    };
  }, []);

  return (
    <FeaturePanelContext.Provider value={contextValue}>
      {false && !anyLoading && <ErrorToolBar />}
      {anyLoading && (
        <StyledLoadingDiv className="_loading">
          <Spinner size="3" />
          <p className="_title">{t("Loading further details…")}</p>
        </StyledLoadingDiv>
      )}
      {children}
    </FeaturePanelContext.Provider>
  );
}
