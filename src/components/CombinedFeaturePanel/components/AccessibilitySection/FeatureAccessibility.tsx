import styled from 'styled-components'
import React from 'react'
import { AnyFeature, isOSMFeature } from '../../../../lib/model/geo/AnyFeature'
import { OSMTagPanel } from './OSMTagPanel'

type Props = {
  feature: AnyFeature;
  children?: React.ReactNode;
};

const Card = styled.section`
  background-color: white;
  padding: 0.25rem 0.5rem;
  box-shadow: 0 0.125rem 4rem rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  margin: 0 -0.25rem;
`

export default function FeatureAccessibility({ children, feature }: Props) {
  if (!isOSMFeature(feature)) {
    return null
  }

  return (
    <Card>
      <OSMTagPanel feature={feature} />
      {children}
    </Card>
  )
}
