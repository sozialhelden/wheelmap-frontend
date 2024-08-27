/**
 * For these tags / accessibility attribute keys, no title label is displayed.
 *
 * This means that the value range of the tag is fully convered with value-specific labels that
 * include the whole information for the tag.
 *
 * The value-specific labels usually are displayed as full sentences.
 */
export const tagsWithoutDisplayedKeySet = new Set([
  'wheelchair',
  'description',
  'wheelchair:description',
  'wheelchair:description:de',
  'wheelchair:description:en',
  'toilets:wheelchair',
  'internet_access',
  'internet_access:fee',
  'acoustic:voice_description',
  'sidewalk',
  'tactile_paving',
  'kerb',
  'bicycle',
  'entrance',
  'crossing',
  'crossing:island',
  'unisex',
  'male',
  'female',
  'queer',
  'toilets',
  'fee',
  'supervised',
  'changing_table',
  'cuisine',
  'outdoor_seating',
  'indoor_seating',
  'healthcare:speciality',
  'air_conditioning',
  'takeaway',
  'social_facility',
  'social_facility:for',
  'community_centre:for',
  'community_centre',
  'delivery',
  'reservation',
  'offer',
  'self_service',
  'building',
  'gay',
  'lesbian',
  'lgbtq',
  'queer',
  'man',
  'woman',
  'elevator',
  'building_object',
  'service:bicycle:pump',
  'get_in',
  'fee:urinal',
  'automatic_door',
  'door:handle',
  'door:wings',
])

export const tagsWithoutDisplayedKeyRegExp = /^(payment|diet):.*$/

/**
 * These tags are not displayed in the accessibility section.
 */
export const omittedKeyPrefixes = [
  'type', // Already covered as icon in the header
  'name', // Already covered as title in the header
  'area', // Not relevant for accessibility, just for visualization and editing
  'opening_hours:signed', // Unclear semantics for visitors
  'opening_hours:covid19', // Not relevant enough right now. Just tested in western countries for now, might need to be added later
  'operator:wikidata',
  'operator:short',
  'operator:wikipedia',
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
]

export const omittedKeySuffixes = [

]

export const omittedKeys = new Set([
  'building',
])

export const tagsWithSemicolonSupport = [
  'access',
  'diet',
  'cuisine',
  'healthcare:speciality',
  'information',
  'kerb',
  'curb',
  'material',
  'operator',
  'level',
  'crossing',
  'socket',
  'surface',
  'toilet',
  'toilets',
  'toilets:position',
  'voltage',
  'healthcare',
  'community_centre',
  'community_centre:for',
  'social_facility',
  'social_facility:for',
]

export const pathsToConsumedTagKeys: [string, RegExp][] = [
  ['building_object.type', /^building$/],
  ['building_object.$1', /^building:([\w_]+)$/],
  ['building_object.$1_level', /^(min|max)_level$/],
  ['payment.$1', /^payment:([\w_]+)$/],
  ['payment.$1.$2', /^payment:([\w_]+):([\w_]+)$/],
  ['payment.description.$1', /^description:payment:([\w_]+)$/],
  ['payment.description', /^description:payment$/],
  ['payment.fee', /^fee$/],
  ['payment.charge', /^charge$/],
  ['payment.charge.$1', /^charge:([\w_]+)$/],
  ['payment.charge.$1', /^([\w_]+):charge$/],
  ['diet.$1', /^diet:([\w_]+)$/],
  ['diet.cuisine', /^cuisine$/],
  ['seating.$1', /^(.*)_?seating$/],
  ['delivery.offered', /^delivery$/],
  ['delivery.partner', /^delivery:partner$/],
  ['internet.access', /^internet_access$/],
  ['internet.$1', /^internet_access:([\w_]+)$/],
  ['ramp.$1', /^ramp:([\w_]+)$/],
  ['handrail.$1', /^handrail:([\w_]+)$/],
  ['changing_table.$1', /^changing_table:([\w_]+)$/],
  ['entrance.door', /^door$/],
  ['entrance.automatic_door', /^automatic_door$/],
  ['entrance.door:$1', /^door:([\w_]+)$/],
  ['entrance.$1.door.automatic', /^automatic_door:([\w_]+)$/],
  ['entrance.step_count', /^step_count$/],
  ['entrance.step_height', /^wheelchair:step_height$/],
  ['entrance.width', /^wheelchair:entrance_width$/],
  ['$1', /^access:([\w_]+)$/],
  ['centralkey', /^centralkey$/],
  ['healthcare.speciality', /^healthcare:speciality$/],
  ['healthcare.dispensing', /^dispensing$/],
  ['capacity.$1', /^capacity:([\w_]+)$/],
  [
    'audience.$1',
    /^(unisex|male|female|child|gay|lgbtq|men|women|gay|lgbtq|queer|community_centre:for)$/,
  ],
  [
    'audience.$1.$2',
    /^(unisex|male|female|child|gay|lgbtq|men|women|gay|lgbtq|queer):(.*)$/,
  ],
  ['audience.$1', /^(social_facility|community_centre):for$/],
  ['toilets.$1', /^toilets:([\w_]+)$/],
  ['payment.fee:urinal', /^fee:urinal$/],
  ['information.tactile_writing.$1.$2', /^tactile_writing:([\w_]+):([\w_]+)$/],
  ['information.speech_output.$1', /^speech_output:([\w_]+)$/],
  ['information.speech_input.$1', /^speech_input:([\w_]+)$/],
  ['information.braille', /^braille$/],
  ['socket.$1.count', /^socket:([\w_]+)$/],
  ['socket.$1.$2', /^socket:([\w_]+):([\w_]+)$/],
  ['sidewalk.sidewalk:$1', /^sidewalk:([\w_]+)$/],
  ['sidewalk.sidewalk:$1.$2', /^sidewalk:([\w_]+):([\w_]+)$/],
  ['crossing.1', /^crossing$/],
  ['crossing.$1', /^crossing:([\w_]+)$/],
  ['description.$1', /^description:([\w_]+)$/],
  ['$1', /(.*)/],
]

export const sortOrderMap = new Map<string, number>([
  ['name', 0],
  ['description', 0.5],
  ['wheelchair', 1],
  ['wheelchair:description', 2],
  ['wheelchair:toilets', 3],
  ['toilets:wheelchair', 4],
  ['toilets', 5],
  ['building', 5.1],
  ['building:use', 5.2],
  ['level', 5.5],
  ['opening_hours', 6],
  ['opening_hours:covid19', 7],
  ['opening_hours:signed', 8],
  ['cuisine', 9.01],
  ['diet', 9.02],
  ['vegan', 9.03],
  ['vegetarian', 9.04],
  ['organic', 9.05],
  ['halal', 9.06],
  ['kosher', 9.07],
  ['seating', 9.1],
  ['reservation', 9.15],
  ['takeaway', 9.2],
  ['delivery', 9.3],
  ['payment', 9.4],
  ['internet_access', 9.7],
  ['internet_access:fee', 9.8],
  ['charging', 14],
  ['amperage', 15],
  ['current', 15],
  ['output', 15],
  ['voltage', 16],
  ['socket', 17],
  ['color', 800],
  ['material', 801],
  ['operator', 1000000000],
  ['smoking', 10000000],
])

export const defaultUnits = new Map<string, string>([
  ['voltage', 'V'],
  ['current', 'A'],
  ['amperage', 'A'],
  ['output', 'W'],
  ['socket', '×'],
])

export const editableKeys = new Set([
  'wheelchair',
  'wheelchair:description',
  'wheelchair:description:de',
  'wheelchair:description:en',
  'toilets:wheelchair',
])

const sidewalkPrefixSet = new Set(['sidewalk', 'sidewalk:left', 'sidewalk:right', 'sidewalk:both'])

export const additionalPrefixesForKeys: Map<string, Set<string>> = new Map([
  // https://wiki.openstreetmap.org/wiki/Key:sidewalk
  ['surface', sidewalkPrefixSet],
  ['smoothness', sidewalkPrefixSet],
  ['width', sidewalkPrefixSet],
  ['est_width', sidewalkPrefixSet],
  ['bicycle', sidewalkPrefixSet],
  ['incline', sidewalkPrefixSet],
  ['kerb', sidewalkPrefixSet],
  ['wheelchair', sidewalkPrefixSet],
  ['tactile_paving', sidewalkPrefixSet],
  ['traffic_sign', sidewalkPrefixSet],
])

export const languageTaggedKeys = new Set([
  'name',
  'operator',
  'building:name',
  'entrance:name',
  'description',
  'wheelchair:description',
  'blind:description',
  'deaf:description',
  'toilets:wheelchair:description',
])

export const horizontalKeys = new Set([
  'payment',
  'internet_access',
  'diet',
])
