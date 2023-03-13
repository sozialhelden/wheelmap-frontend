import React from "react";
import { AnyFeature } from "../../../lib/model/shared/AnyFeature";

const FeatureContext = React.createContext<AnyFeature | undefined>(undefined);

export default FeatureContext;