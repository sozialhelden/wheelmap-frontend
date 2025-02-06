import type React from "react";
import type IAccessibilityAttribute from "../../../../lib/model/ac/IAccessibilityAttribute";

export type OSMTagProps = {
  tagKey: string;
  hasDisplayedKey: boolean;
  keyLabel: React.ReactNode;
  valueElement: React.ReactNode;
  isEditable: boolean;
  editURL: string;
  valueDetails?: string;
  keyDetails?: string;
  keyAttribute?: IAccessibilityAttribute;
  valueAttribute?: IAccessibilityAttribute;
  isHorizontal?: boolean;
};
