import { LayerProps } from 'react-map-gl'

export const layers = [
  {
    id: 'Wheelchair Ramp Points',
    type: 'fill',
    'source-layer': 'ramps_germany-7clq7v',
    minzoom: 11.4,
    layout: {},
    paint: {},
  },
  {
    id: 'Wheelchair Ramp Points copy',
    type: 'symbol',
    'source-layer': 'ramps_germany-7clq7v',
    minzoom: 15.3,
    filter: ['match', ['get', 'ramp'], ['yes', 'wheelchair'], true, false],
    layout: { 'text-field': 'Rampe', 'text-offset': [0, 0] },
    paint: { 'text-translate': [0, 20] },
  },
  {
    id: 'Wheelchair Ramp Points copy 1',
    type: 'symbol',
    'source-layer': 'ramps_germany-7clq7v',
    minzoom: 15.3,
    filter: ['match', ['get', 'ramp'], ['yes', 'wheelchair'], true, false],
    layout: { 'text-offset': [0, 0] },
    paint: { 'text-translate': [0, 20] },
  },
  {
    id: 'Building outlines',
    type: 'line',
    'source-layer': 'buildings_saarbruecken-48j0n6',
    filter: ['has', 'wheelchair'],
    layout: {},
    paint: {
      'line-color': [
        'match',
        ['get', 'wheelchair'],
        ['yes'],
        'hsl(129, 93%, 44%)',
        ['limited'],
        'hsl(40, 93%, 54%)',
        ['no'],
        'hsl(0, 97%, 49%)',
        '#000000',
      ],
      'line-dasharray': [2, 2],
      'line-width': 1.1,
    },
  },
]

export const entrancesWheelchairDescriptionLayer: LayerProps = {
  source: 'entrances_or_exits',
  'source-layer': 'default',
  id: 'wheelchairDescription',
  type: 'symbol',
  minzoom: 14.8,
  filter: ['match', ['get', 'access'], ['no'], false, true],
  layout: {
    'text-field': [
      'to-string',
      [
        'coalesce',
        ['get', 'wheelchair:description:de'],
        ['get', 'wheelchair:description'],
      ],
    ],
    'text-size': 10,
    'text-justify': 'right',
    'text-anchor': 'right',
    'icon-allow-overlap': true,
    'text-offset': [-0.7, 0],
  },
  paint: {
    'text-color': [
      'match',
      ['get', 'wheelchair'],
      ['no'],
      'hsl(0, 92%, 49%)',
      ['limited'],
      'hsl(35, 95%, 43%)',
      ['yes'],
      'hsl(116, 93%, 39%)',
      '#000000',
    ],
  },
}
export const entranceStepHeightLayer: LayerProps = {
  source: 'entrances_or_exits',
  'source-layer': 'default',
  id: 'Step height',
  type: 'symbol',
  minzoom: 16.8,
  layout: {
    'text-size': 10,
    'text-justify': 'left',
    'text-anchor': 'left',
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'text-field': [
      'case',
      ['!=', ['get', 'wheelchair:step_height'], null],
      ['to-string', ['concat', ['get', 'wheelchair:step_height'], ' cm']],
      '',
    ],
    'text-offset': [0.7, 0],
  },
  paint: {
    'text-color': [
      'match',
      ['get', 'wheelchair'],
      ['no'],
      'hsl(0, 92%, 49%)',
      ['limited'],
      'hsl(35, 95%, 43%)',
      ['yes'],
      'hsl(116, 93%, 39%)',
      '#000000',
    ],
  },
}

export const entranceCircleLayer: LayerProps = {
  source: 'entrances_or_exits',
  'source-layer': 'default',
  id: 'Colored entrance',
  type: 'circle',
  filter: ['has', 'wheelchair'],
  layout: {},
  minzoom: 13,
  paint: {
    'circle-color': [
      'match',
      ['get', 'wheelchair'],
      ['no'],
      'hsl(0, 92%, 49%)',
      ['limited'],
      'hsl(35, 95%, 43%)',
      ['yes'],
      'hsl(116, 93%, 39%)',
      '#000000',
    ],
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 13, 1, 22, 5],
  },
}
