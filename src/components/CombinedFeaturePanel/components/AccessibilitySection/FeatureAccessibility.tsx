import styled from 'styled-components'
import React from 'react'
import { AnyFeature, isOSMFeature } from '../../../../lib/model/geo/AnyFeature'
import { OSMTagPanel } from './OSMTagPanel'

type Props = {
  feature: AnyFeature;
  children?: React.ReactNode;
};

const Card = styled.section`
  padding: 0.25rem 0.5rem;
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
