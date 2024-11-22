/**
 * These tags are not displayed in the accessibility section.
 */
export const omittedKeyPrefixes: (string | RegExp)[] = [
  'type', // Already covered as icon in the header
  'name', // Already covered as title in the header
  'area', // Not relevant for accessibility, just for visualization and editing
  'opening_hours:signed', // Unclear semantics for visitors
  'opening_hours:covid19', // Not relevant enough right now. Just tested in western countries for now, might need to be added later
  'operator:wikidata',
  'operator:short',
  'operator:wikipedia',
  /operator:\d+/,
  'toilets:position',
  'takeaway:covid19',
  'delivery:covid19',
  'access:covid19',
  'bicycle:air',
  'operator:type',
  'tactile_paving',
  'payment:cryptocurrencies',
  'building:height',
  'building:parts',
  'building:roof',
  'building:levels:underground',
  'building:architecture',
  'description:covid19', // Seems to contain non-maintained leftovers from the first wave of the pandemic.
]
