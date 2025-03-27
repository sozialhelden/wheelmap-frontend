import type {
  A11yJSONTypeMapping,
  AccessibilityCloudTypeMapping,
} from "./AccessibilityCloudTypeMapping";
import type { OSMTypeMapping } from "./OSMTypeMapping";
import type { PhotonTypeMapping } from "./PhotonTypeMapping";

export type TypeMapping = AccessibilityCloudTypeMapping &
  OSMTypeMapping &
  PhotonTypeMapping &
  A11yJSONTypeMapping;
export type KnownTypeString = keyof TypeMapping;
export type HasTypeTag<S extends KnownTypeString> = { "@type": S };
export type TypeTagged<S extends KnownTypeString> = TypeMapping[S] &
  HasTypeTag<S>;
export type TypeTaggedWithId<S extends KnownTypeString> = TypeTagged<S> & {
  _id: string;
};
