import React from "react";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

type MaybeFeature = AnyFeature | null;

const FeatureContext: React.Context<MaybeFeature> =
  React.createContext<MaybeFeature>(null);

export default FeatureContext;
