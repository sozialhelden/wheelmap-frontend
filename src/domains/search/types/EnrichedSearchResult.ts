import type { LocalizedString } from "@sozialhelden/a11yjson";
import type {
  AnyFeature,
  TypeTaggedPhotonSearchResultFeature,
  TypeTaggedPlaceInfo,
} from "~/lib/model/geo/AnyFeature";

export interface EnrichedSearchResultDisplayData {
  title?: string | LocalizedString;
  address?: string | LocalizedString;
  lat: number;
  lon: number;
  extent?: [number, number, number, number];
}

export interface EnrichedSearchResult {
  "@type": "wheelmap:EnrichedSearchResult";
  displayData: EnrichedSearchResultDisplayData;
  photonResult: TypeTaggedPhotonSearchResultFeature | null;
  featureId?: string;
  osmFeatureLoading: boolean;
  osmFeature: AnyFeature | null;
  placeInfoLoading: boolean;
  placeInfo: TypeTaggedPlaceInfo | null;
}
