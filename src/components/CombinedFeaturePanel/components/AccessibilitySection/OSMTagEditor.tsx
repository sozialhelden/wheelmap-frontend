import React from "react";
import OSMFeature from "../../../../lib/model/osm/OSMFeature";

export function OSMTagEditor({ feature, tag, onValueChange }: { feature: OSMFeature; tag: string; onValueChange: (value: string) => void; }) {
  const value = feature?.properties?.[tag];
  return (
    <>
      <input type="text" value={value} onChange={(e) => onValueChange(e.target.value)} />
    </>
  );
}
