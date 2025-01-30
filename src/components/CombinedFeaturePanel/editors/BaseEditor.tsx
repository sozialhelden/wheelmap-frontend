import type React from "react";
import type { AnyFeature } from "../../../lib/model/geo/AnyFeature";
import type { EditorTagValue } from "./EditorTagValue";

export type BaseEditorProps = {
  feature: AnyFeature;
  tagKey?: string;
  onUrlMutationSuccess?: (urls: string[]) => void;
  onChange?: (tagValue: EditorTagValue) => void;
  handleSubmitButtonClick?: () => void;
  addingNewLanguage?: boolean;
  passLanguagePickerValueToParent?: (languageTag: string) => void;
};

export type BaseEditorComponent = React.FC<BaseEditorProps>;
