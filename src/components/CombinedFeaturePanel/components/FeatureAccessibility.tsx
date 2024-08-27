import styled from 'styled-components';
import { AnyFeature, isOSMFeature } from '../../../lib/model/geo/AnyFeature';
import { OSMTagPanel } from './AccessibilitySection/OSMTagPanel';

type Props = {
  feature: AnyFeature;
};

const Card = styled.section`
  background-color: white;
  padding: 0.25rem 0.5rem;
  box-shadow: 0 0.125rem 1.125rem rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  margin: 0 -0.25rem;
`;

export default function FeatureAccessibility({ feature }: Props) {
  return (
    <>
      {isOSMFeature(feature) && (
      <Card>
        <OSMTagPanel feature={feature} />
      </Card>
      )}
    </>
  );
}
