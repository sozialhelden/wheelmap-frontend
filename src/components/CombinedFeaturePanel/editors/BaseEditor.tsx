import type React from "react";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";

export type BaseEditorProps = {
  feature: AnyFeature;
  tagKey?: string;
  onUrlMutationSuccess?: (urls: string[]) => void;
  onChange?: (tagValue: string) => void;
  handleSubmitButtonClick?: () => void;
  addingNewLanguage?: boolean;
  onLanguageChange?: (languageTag: string) => void;
};

export type BaseEditorComponent = React.FC<BaseEditorProps>;
