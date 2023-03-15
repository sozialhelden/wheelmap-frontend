import React, { useState } from "react";
import OSMFeature from "../../../../lib/model/osm/OSMFeature";
import { getOSMType } from "../../../../lib/model/shared/generateOsmUrls";

export function OSMTagEditor({ feature, tag, onChange, onSubmit }: { feature: OSMFeature; tag: string, onChange: (value: string) => void, onSubmit: () => void }) {
  const onChangeInput = React.useCallback((e) => {
    onChange(e.target.value);
  }, []);
  const value = feature?.properties[tag];

  return (
    <form onSubmitCapture={onSubmit}>
      <input type="text" value={value} onChange={onChangeInput} />
    </form>
  );
}

