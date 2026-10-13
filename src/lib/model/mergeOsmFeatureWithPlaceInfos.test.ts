import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hasAccessibleToilet, isWheelchairAccessible } from '../Feature';
import { mergeOsmFeatureWithPlaceInfos, osmSameAsURIForFeature } from './mergeOsmFeatureWithPlaceInfos';

const osmFeature: any = {
  type: 'Feature',
  id: 42,
  geometry: null,
  properties: {
    id: 42,
    osm_type: 'node',
    name: 'OSM name',
    node_type: { identifier: 'cafe' },
    category: { identifier: 'food' },
    wheelchair: 'no',
    wheelchair_toilet: 'no',
    wheelchair_description: 'OSM description',
    phone: '111',
    website: 'https://osm.example',
  },
};

const olderPlaceInfo: any = {
  properties: {
    _id: 'older',
    sourceId: 'source1',
    lastUpdate: '2020-01-01',
    name: { de: 'Older name' },
    accessibility: { accessibleWith: { wheelchair: false } },
  },
};

const newerPlaceInfo: any = {
  properties: {
    _id: 'newer',
    sourceId: 'source2',
    lastUpdate: '2024-01-01',
    name: { de: 'Place info name' },
    category: 'restaurant',
    phoneNumber: '222',
    placeWebsiteUrl: 'https://ac.example',
    accessibility: {
      accessibleWith: { wheelchair: true },
      restrooms: [{ isAccessibleWithWheelchair: true }],
    },
  },
};

describe('mergeOsmFeatureWithPlaceInfos', () => {
  it('returns the OSM feature unchanged without place infos', () => {
    assert.equal(mergeOsmFeatureWithPlaceInfos(osmFeature, []), osmFeature);
  });

  it('lets place info values override OSM values, the newest place info winning', () => {
    const properties: any = mergeOsmFeatureWithPlaceInfos(osmFeature, [newerPlaceInfo, olderPlaceInfo])
      .properties;
    assert.deepEqual(properties.name, { de: 'Place info name' });
    assert.equal(properties.node_type.identifier, 'restaurant');
    assert.equal(isWheelchairAccessible(properties), 'yes');
    assert.equal(hasAccessibleToilet(properties), 'yes');
    assert.equal(properties.phone, '222');
    assert.equal(properties.website, 'https://ac.example');
    assert.equal(properties.sourceId, 'source2');
  });

  it('keeps OSM identity and OSM-only values', () => {
    const merged: any = mergeOsmFeatureWithPlaceInfos(osmFeature, [newerPlaceInfo]);
    assert.equal(merged.id, 42);
    assert.equal(merged.properties.id, 42);
    assert.equal(merged.properties.osm_type, 'node');
    assert.deepEqual(merged.properties.category, { identifier: 'food' });
    assert.equal(merged.properties._id, undefined);
    assert.equal(merged.properties.wheelchair_description, 'OSM description');
  });

  it('keeps OSM values the place info does not know', () => {
    const placeInfo: any = { properties: { _id: 'unknown', sourceId: 'source3', accessibility: { restrooms: null } } };
    const properties: any = mergeOsmFeatureWithPlaceInfos(osmFeature, [placeInfo]).properties;
    assert.equal(properties.wheelchair, 'no');
    assert.equal(properties.name, 'OSM name');
    // `restrooms: null` means "no restrooms" and must survive the merge
    assert.equal(properties.accessibility.restrooms, null);
  });

  it('does not mutate the OSM feature', () => {
    mergeOsmFeatureWithPlaceInfos(osmFeature, [newerPlaceInfo]);
    assert.equal(osmFeature.properties.wheelchair, 'no');
    assert.equal('accessibility' in osmFeature.properties, false);
  });
});

describe('osmSameAsURIForFeature', () => {
  it('builds the URI accessibility.cloud uses in sameAs', () => {
    assert.equal(osmSameAsURIForFeature('node', '1743391754'), 'https://openstreetmap.org/node/1743391754');
    assert.equal(osmSameAsURIForFeature('way', -123), 'https://openstreetmap.org/way/123');
  });
});
