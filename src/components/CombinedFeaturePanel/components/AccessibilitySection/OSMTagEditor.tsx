import React, { useState } from "react";
import OSMFeature from "../../../../lib/model/osm/OSMFeature";
import { getOSMType } from "../../../../lib/model/shared/generateOsmUrls";

export function OSMTagEditor({ feature, tag, onChange, onSubmit }: { feature: OSMFeature; tag: string, onChange: (value: string) => void, onSubmit: () => void }) {
  const onChangeInput = React.useCallback((e) => {
    onChange(e.target.value);
  }, []);
  const value = feature?.properties[tag];
  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit();
  }, []);

  return (
    <form onSubmitCapture={handleSubmit}>
      <input type="text" value={value} onChange={onChangeInput} />
    </form>
  );
}

