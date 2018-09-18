// @flow

import { t } from 'ttag';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import * as React from 'react';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';

import type { Feature } from '../../lib/Feature';
import LicenseHint from './LicenseHint';

type Props = {
  feature: ?Feature,
  featureId: ?string | number,
  equipmentInfoId: ?string,
  history: RouterHistory,
  className: string,
};

export function sourceIdsForFeature(feature: ?Feature): string[] {
  if (!feature) return [];

  const properties = feature.properties;
  if (!properties) return [];

  const idsToEquipmentInfos =
    typeof properties.equipmentInfos === 'object' ? properties.equipmentInfos : null;
  const equipmentInfos = idsToEquipmentInfos
    ? Object.keys(idsToEquipmentInfos).map(_id => idsToEquipmentInfos[_id])
    : [];
  const equipmentInfoSourceIds = equipmentInfos.map(equipmentInfo =>
    get(equipmentInfo, 'properties.sourceId')
  );
  const disruptionSourceIds = equipmentInfos.map(equipmentInfo =>
    get(equipmentInfo, 'properties.lastDisruptionProperties.sourceId')
  );
  const placeSourceId =
    properties && typeof properties.sourceId === 'string' ? properties.sourceId : null;

  return uniq([placeSourceId, ...equipmentInfoSourceIds, ...disruptionSourceIds].filter(Boolean));
}

function UnstyledSourceList(props: Props) {
  const sourceIds = sourceIdsForFeature(props.feature);
  // translator: Prefix for the sources on the PoI details panel
  const prefixCaption = t`Source:`;

  return (
    <section className={props.className}>
      {sourceIds.length ? `${prefixCaption} ` : null}
      <ul>{sourceIds.map(sourceId => <LicenseHint key={sourceId} sourceId={sourceId} />)}</ul>
    </section>
  );
}

const SourceList = styled(UnstyledSourceList)`
  margin: .5rem 0;

  font-size: 80%;
  opacity: 0.5;

  ul, li {
    display: inline;
    margin: 0;
    padding: 0;
  }

  li + li:before {
    content: ', ';
  }
}`;

export default SourceList;
