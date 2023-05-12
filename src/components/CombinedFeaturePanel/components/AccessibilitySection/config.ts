/**
 * For these tags / accessibility attribute keys, no title label is displayed.
 *
 * This means that the value range of the tag is fully convered with value-specific labels that
 * include the whole information for the tag.
 *
 * The value-specific labels usually are displayed as full sentences.
 */
export const tagsWithoutDisplayedKey = new Set([
  "wheelchair",
  "description",
  "wheelchair:description",
  "wheelchair:description:de",
  "wheelchair:description:en",
  "toilets:wheelchair",
  "internet_access:fee",
  "acoustic:voice_description",
]);

/**
 * These tags are not displayed in the accessibility section.
 */
export const omittedKeyPrefixes = [
  "type", // Already covered as icon in the header
  "name", // Already covered as title in the header
  "area", // Not relevant for accessibility, just for visualization and editing
  "opening_hours:signed", // Unclear semantics for visitors
  "opening_hours:covid19", // Not relevant enough right now. Just tested in western countries for now, might need to be added later
  "operator:wikidata",
  "payment:cryptocurrencies",
  "operator:short",
  "operator:wikipedia",
  "toilets:position",
  "takeaway:covid19",
  "delivery:covid19",
  "bicycle:air",
  "operator:type",
];

export const tagsWithSemicolonSupport = [
  "access",
  "diet",
  "cuisine",
  "healthcare:speciality",
  "operator",
  "level",
  "crossing",
  "socket",
  "surface",
  "toilet",
  "toilets",
  "toilets:position",
  "voltage",
  "healthcare",
];

export const pathsToConsumedTagKeys: [string, RegExp][] = [
  ["payment.$1", /^payment:([\w_]+)$/],
  ["payment.$1.$2", /^payment:([\w_]+):([\w_]+)$/],
  ["description.payment$1", /^payment:([\w_]+)$/],
  ["payment.description.$1", /^description:payment:([\w_]+)$/],
  ["payment.description", /^description:payment$/],
  ["diet.$1", /^diet:([\w_]+)$/],
  ["diet.cuisine", /^cuisine$/],
  ["seating.$1", /^(.*)_?seating$/],
  ["delivery.offered", /^delivery$/],
  ["delivery.partner", /^delivery:partner$/],
  ["internet.access", /^internet_access$/],
  ["internet.$1", /^internet_access:([\w_]+)$/],
  ["ramp.$1", /^ramp:([\w_]+)$/],
  ["handrail.$1", /^handrail:([\w_]+)$/],
  ["changing_table.$1", /^changing_table:([\w_]+)$/],
  ["entrance.door", /^door$/],
  ["entrance.automatic_door", /^automatic_door$/],
  ["entrance.door:wings", /^door:wings$/],
  ["entrance.$1.door.automatic", /^automatic_door:([\w_]+)$/],
  ["entrance.step_count", /^step_count$/],
  ["entrance.step_height", /^wheelchair:step_height$/],
  ["entrance.width", /^wheelchair:entrance_width$/],
  ["access.note", /^access:note$/],
  ["healthcare.speciality", /^healthcare:speciality$/],
  ["healthcare.dispensing", /^dispensing$/],
  ["capacity.total", /^capacity$/],
  ["capacity.$1", /^capacity:([\w_]+)$/],
  [
    "audience.$1",
    /^(unisex|male|female|child|gay|lgbtq|men|women|gay|lgbtq|queer)$/,
  ],
  [
    "audience.$1.$2",
    /^(unisex|male|female|child|gay|lgbtq|men|women|gay|lgbtq|queer):(.*)$/,
  ],
  ["toilets.$1", /^toilets:([\w_]+)$/],
  ["information.tactile_writing.$1.$2", /^tactile_writing:([\w_]+):([\w_]+)$/],
  ["information.speech_output.$1", /^speech_output:([\w_]+)$/],
  ["information.speech_input.$1", /^speech_input:([\w_]+)$/],
  ["information.braille", /^braille$/],
  ["socket.$1.count", /^socket:([\w_]+)$/],
  ["socket.$1.$2", /^socket:([\w_]+):([\w_]+)$/],
  ["$1", /(.*)/],
];

export const sortOrderMap = new Map<string, number>([
  ['name', 0 ],
  ['description', 0.5 ],
  ['wheelchair', 1 ],
  ['wheelchair:description', 2 ],
  ['wheelchair:toilets', 3 ],
  ['toilets:wheelchair', 4 ],
  ['toilets', 5],
  ['level', 5.5 ],
  ['opening_hours', 6],
  ['opening_hours:covid19', 7],
  ['opening_hours:signed', 8],
  ['payment', 9],
  ['diet', 10],
  ['cuisine', 11],
  ['internet_access', 12],
  ['internet_access:fee', 13],
  ['charging', 14],
  ['amperage', 15],
  ['voltage', 16],
  ['socket', 17],
]);

export const editableKeys = new Set([
  "wheelchair",
  "wheelchair:description",
  "wheelchair:description:de",
  "wheelchair:description:en",
  "toilets:wheelchair",
]);
