const sidewalkPrefixSet = new Set([
  "sidewalk",
  "sidewalk:left",
  "sidewalk:right",
  "sidewalk:both",
]);

export const additionalPrefixesForKeys: Map<string, Set<string>> = new Map([
  // https://wiki.openstreetmap.org/wiki/Key:sidewalk
  ["surface", sidewalkPrefixSet],
  ["smoothness", sidewalkPrefixSet],
  ["width", sidewalkPrefixSet],
  ["est_width", sidewalkPrefixSet],
  ["bicycle", sidewalkPrefixSet],
  ["incline", sidewalkPrefixSet],
  ["kerb", sidewalkPrefixSet],
  ["wheelchair", sidewalkPrefixSet],
  ["tactile_paving", sidewalkPrefixSet],
  ["traffic_sign", sidewalkPrefixSet],
]);
