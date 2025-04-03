import React from "react";
import type OSMFeature from "~/needs-refactoring/lib/model/osm/OSMFeature";

export function OSMTagEditor({
  feature,
  tag,
  onChange,
  onSubmit,
}: {
  feature: OSMFeature;
  tag: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const onChangeInput = React.useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );
  const value = feature?.properties[tag];
  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onSubmit();
    },
    [onSubmit],
  );

  return (
    <form onSubmitCapture={handleSubmit}>
      <input type="text" value={value} onChange={onChangeInput} />
    </form>
  );
}
