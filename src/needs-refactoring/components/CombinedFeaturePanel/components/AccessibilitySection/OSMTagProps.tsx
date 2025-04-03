import type React from "react";
import type IAccessibilityAttribute from "~/needs-refactoring/lib/model/ac/IAccessibilityAttribute";

export type OSMTagProps = {
  tagKey: string;
  hasDisplayedKey: boolean;
  keyLabel: React.ReactNode;
  valueElement: React.ReactNode;
  isEditable: boolean;
  isLanguageTagged: boolean;
  valueDetails?: string;
  keyDetails?: string;
  keyAttribute?: IAccessibilityAttribute;
  valueAttribute?: IAccessibilityAttribute;
  isHorizontal?: boolean;
};
