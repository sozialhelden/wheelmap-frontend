import React from "react";
import IAccessibilityAttribute from "../../../../lib/model/ac/IAccessibilityAttribute";


export type OSMTagProps = {
  key: string;
  hasDisplayedKey: boolean;
  keyLabel: React.ReactNode;
  valueElement: React.ReactNode;
  isEditable: boolean;
  editURL: string;
  shownDetailsLine: string;
  keyAttribute: IAccessibilityAttribute;
  valueAttribute: IAccessibilityAttribute;
};
