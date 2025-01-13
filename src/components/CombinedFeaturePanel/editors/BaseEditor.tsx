import type React from "react";
import type { AnyFeature } from "../../../lib/model/geo/AnyFeature";
import type { EditorTagValue } from "./EditorTagValue";

export type BaseEditorProps = {
  tagKey: string;
  feature: AnyFeature;
  addingNewLanguage: boolean;
  onUrlMutationSuccess: (urls: string[]) => void;
  onChange: (tagValue: EditorTagValue) => void;
  handleSubmitButtonClick: () => void;
  passLanguagePickerValueToParent?: (languageTag: string) => void;
};

export type BaseEditorComponent = React.FC<BaseEditorProps>;
