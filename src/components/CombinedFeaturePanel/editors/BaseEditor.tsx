import type React from "react";
import type { AnyFeature } from "../../../lib/model/geo/AnyFeature";

export type BaseEditorProps = {
  tagKey: string;
  feature: AnyFeature;
  onUrlMutationSuccess: (urls: string[]) => void;
  onChange: (tagValue: string) => void;
  handleSubmitButtonClick: () => void;
};

export type BaseEditorComponent = React.FC<BaseEditorProps>;
