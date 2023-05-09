import React from "react";


export type OSMTagProps = {
  key: string;
  hasDisplayedKey: boolean;
  keyLabel: React.ReactNode;
  valueElement: React.ReactNode;
  isEditable: boolean;
  editURL: string;
  shownDetailsLine: string;
};
