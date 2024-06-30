import React from "react";
import { AnyFeature } from "../../../lib/model/geo/AnyFeature";

const FeatureContext = React.createContext<AnyFeature | undefined>(undefined);

export default FeatureContext;