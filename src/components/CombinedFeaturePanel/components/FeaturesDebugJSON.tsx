import { Button } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { omit } from 'lodash';
import styled from 'styled-components';
import { AnyFeature } from '../../../lib/model/geo/AnyFeature';

const Pre = styled.pre`
  margin: 0;
  padding: 1rem;
`;

export default function FeaturesDebugJSON(props: { features: AnyFeature[] }) {
  const json = (
    <Pre style={{
      maxHeight: '300px', maxWidth: '500px', overflow: 'auto', fontSize: '10px',
    }}
    >
      {JSON.stringify(
        props.features.map((f) => omit(f, 'geometry.coordinates', 'centroid', 'type')),
        null,
        2,
      )}
    </Pre>
  );

  return (
    <Popover2 content={json} lazy minimal>
      <Button intent="none" text="JSON" />
    </Popover2>
  );
}
