import type React from "react";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

export type BaseEditorProps = {
  feature: AnyFeature;
  tagKey?: string;
  onUrlMutationSuccess?: (urls: string[]) => void;
  onChange?: (tagValue: string) => void;
  onSubmit?: () => void;
  addNewLanguage?: boolean;
  onLanguageChange?: (languageTag: string) => void;
  onClose?: () => void;
};

export type BaseEditorComponent = React.FC<BaseEditorProps>;
