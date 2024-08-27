import React from 'react'
import IAccessibilityAttribute from '../../../../lib/model/ac/IAccessibilityAttribute'

export type OSMTagProps = {
  key: string;
  keyName: string;
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
