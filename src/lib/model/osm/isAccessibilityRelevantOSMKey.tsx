/**
 * Takes a list of OSM keys, and returns a Set of the keys that are relevant for accessibility.
 */

export const accessibilityPrefixes = new Set([
  'access', // https://wiki.openstreetmap.org/wiki/Key:access
  'acoustic', // https://wiki.openstreetmap.org/wiki/Key:acoustic (for traffic_signals)
  'air_conditioning', // https://wiki.openstreetmap.org/wiki/Key:air_conditioning
  'amperage', // https://wiki.openstreetmap.org/wiki/Key:amperage
  'automatic_door', // https://wiki.openstreetmap.org/wiki/Key:automatic_door
  'barrier', // https://wiki.openstreetmap.org/wiki/Key:barrier
  'bicycle', // https://wiki.openstreetmap.org/wiki/Key:bicycle
  'electric_bicycle', // https://wiki.openstreetmap.org/wiki/Key:electric_bicycle
  'blind', // https://wiki.openstreetmap.org/wiki/Key:blind
  'braille', // https://wiki.openstreetmap.org/wiki/Key:braille
  'building', // https://wiki.openstreetmap.org/wiki/Key:building
  'building:part',
  'building:colour',
  'building:max_level',
  'building:min_level',
  'max_level',
  'min_level',
  'building:flats',
  'building:levels',
  'capacity', // https://wiki.openstreetmap.org/wiki/Key:capacity
  'centralkey', // https://wiki.openstreetmap.org/wiki/Key:centralkey
  'community_centre', // https://wiki.openstreetmap.org/wiki/Key:community_centre
  'baby_feeding', // https://wiki.openstreetmap.org/wiki/Key:baby_feeding
  'changing_table', // https://wiki.openstreetmap.org/wiki/Key:changing_table
  'compressed_air', // https://wiki.openstreetmap.org/wiki/Key:compressed_air
  'charge', // https://wiki.openstreetmap.org/wiki/Key:charge
  'crossing', // https://wiki.openstreetmap.org/wiki/Key:crossing
  'cuisine', // https://wiki.openstreetmap.org/wiki/Key:cuisine
  'cycleway', // https://wiki.openstreetmap.org/wiki/Key:cycleway
  'deaf', // https://wiki.openstreetmap.org/wiki/Key:deaf
  'delivery', // https://wiki.openstreetmap.org/wiki/Key:delivery
  'depth', // https://wiki.openstreetmap.org/wiki/Key:depth
  'description', // https://wiki.openstreetmap.org/wiki/Key:description
  'description:payment', // https://wiki.openstreetmap.org/wiki/Key:description
  'diet', // https://wiki.openstreetmap.org/wiki/Key:diet
  'disabled', // https://wiki.openstreetmap.org/wiki/Key:disabled
  'dispensing', // https://wiki.openstreetmap.org/wiki/Key:dispensing
  'dog', // https://wiki.openstreetmap.org/wiki/Key:dog
  'door', // https://wiki.openstreetmap.org/wiki/Key:door
  'drinking_water', // https://wiki.openstreetmap.org/wiki/Key:drinking_water
  'est_width', // https://wiki.openstreetmap.org/wiki/Key:est_width
  'elevator', // https://wiki.openstreetmap.org/wiki/Key:elevator
  'emergency', // https://wiki.openstreetmap.org/wiki/Key:emergency
  'entrance', // https://wiki.openstreetmap.org/wiki/Key:entrance
  'escalator', // https://wiki.openstreetmap.org/wiki/Key:escalator
  'fee', // https://wiki.openstreetmap.org/wiki/Key:fee
  'female', // https://wiki.openstreetmap.org/wiki/Key:female
  'floating', // https://wiki.openstreetmap.org/wiki/Key:floating
  'foot', // https://wiki.openstreetmap.org/wiki/Key:foot
  'gay', // https://wiki.openstreetmap.org/wiki/Key:gay
  'handrail', // https://wiki.openstreetmap.org/wiki/Key:handrail
  'height', // https://wiki.openstreetmap.org/wiki/Key:height
  'incline', // https://wiki.openstreetmap.org/wiki/Key:incline
  'indoor', // https://wiki.openstreetmap.org/wiki/Key:indoor
  'information', // https://wiki.openstreetmap.org/wiki/Key:information
  'internet_access', // https://wiki.openstreetmap.org/wiki/Key:internet_access
  'kerb', // https://wiki.openstreetmap.org/wiki/Key:kerb
  'lesbian', // https://wiki.openstreetmap.org/wiki/Key:lesbian
  'level', // https://wiki.openstreetmap.org/wiki/Key:level
  'lgbtq', // https://wiki.openstreetmap.org/wiki/Key:lgbtq
  'lit', // https://wiki.openstreetmap.org/wiki/Key:lit
  'location', // https://wiki.openstreetmap.org/wiki/Key:location
  'male', // https://wiki.openstreetmap.org/wiki/Key:male
  'material', // https://wiki.openstreetmap.org/wiki/Key:material
  'max_age', // https://wiki.openstreetmap.org/wiki/Key:max_age
  'min_age', // https://wiki.openstreetmap.org/wiki/Key:min_age
  'opening_hours', // https://wiki.openstreetmap.org/wiki/Key:opening_hours
  'outdoor_seating', // https://wiki.openstreetmap.org/wiki/Key:outdoor_seating
  'operator', // https://wiki.openstreetmap.org/wiki/Key:operator
  'indoor_seating', // https://wiki.openstreetmap.org/wiki/Key:indoor_seating
  'parking', // https://wiki.openstreetmap.org/wiki/Key:parking
  'payment', // https://wiki.openstreetmap.org/wiki/Key:payment
  'power_supply', // https://wiki.openstreetmap.org/wiki/Key:power_supply
  'queer', // https://wiki.openstreetmap.org/wiki/Key:queer
  'ramp', // https://wiki.openstreetmap.org/wiki/Key:ramp
  'reservation', // https://wiki.openstreetmap.org/wiki/Key:reservation
  'room', // https://wiki.openstreetmap.org/wiki/Key:room
  'self_service', // https://wiki.openstreetmap.org/wiki/Key:self_service
  'sidewalk', // https://wiki.openstreetmap.org/wiki/Key:sidewalk
  'sloped_curb', // https://wiki.openstreetmap.org/wiki/Key:sloped_curb
  'stroller', // https://wiki.openstreetmap.org/wiki/Key:stroller
  'smoking', // https://wiki.openstreetmap.org/wiki/Key:smoking
  'smoothness', // https://wiki.openstreetmap.org/wiki/Key:smoothness
  'socket', // https://wiki.openstreetmap.org/wiki/Key:socket
  'social_facility', // https://wiki.openstreetmap.org/wiki/Key:social_facility
  'speech_input', // https://wiki.openstreetmap.org/wiki/Key:speech_input
  'speech_output', // https://wiki.openstreetmap.org/wiki/Key:speech_output
  'step_count', // https://wiki.openstreetmap.org/wiki/Key:step_count
  'surface', // https://wiki.openstreetmap.org/wiki/Key:surface
  'supervised', // https://wiki.openstreetmap.org/wiki/Key:supervised
  'service:bicycle:pump', // https://wiki.openstreetmap.org/wiki/Key:service:bicycle:pump
  // "surveillance",
  'tactile_paving', // https://wiki.openstreetmap.org/wiki/Key:tactile_paving
  'tactile_writing', // https://wiki.openstreetmap.org/wiki/Key:tactile_writing
  'takeaway', // https://wiki.openstreetmap.org/wiki/Key:takeaway
  'toilet', // https://wiki.openstreetmap.org/wiki/Key:toilet
  'toilets', // https://wiki.openstreetmap.org/wiki/Key:toilets
  'traffic_signals', // https://wiki.openstreetmap.org/wiki/Key:traffic_signals
  'track', // https://wiki.openstreetmap.org/wiki/Key:track
  'unisex', // https://wiki.openstreetmap.org/wiki/Key:unisex
  'voltage', // https://wiki.openstreetmap.org/wiki/Key:voltage
  'wheelchair', // https://wiki.openstreetmap.org/wiki/Key:wheelchair
  'wheelchair:description', // https://wiki.openstreetmap.org/wiki/Key:wheelchair:description
  'width', // https://wiki.openstreetmap.org/wiki/Key:width
  'winter_service', // https://wiki.openstreetmap.org/wiki/Key:winter_service
  'healthcare', // https://wiki.openstreetmap.org/wiki/Key:healthcare
  'healthcare:speciality', // https://wiki.openstreetmap.org/wiki/Key:healthcare:speciality
])

export default function isAccessibilityRelevantOSMKey(osmKey: string): boolean {
  return (
    accessibilityPrefixes.has(osmKey)
    || accessibilityPrefixes.has(osmKey.substr(0, osmKey.indexOf(':')))
  )
}
