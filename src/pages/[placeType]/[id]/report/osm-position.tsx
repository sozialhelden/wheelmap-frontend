import React, {
  FC, ReactElement, useContext,
} from 'react'
import { t } from 'ttag'
import { center } from '@turf/turf'
import { PointGeometry } from '@sozialhelden/a11yjson'
import { MultiPolygon, Point, Polygon } from 'geojson'
import { StyledReportView } from '.'
import StyledMarkdown from '../../../../components/shared/StyledMarkdown'
import { FeaturePanelContext } from '../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import { isOSMFeature } from '../../../../lib/model/geo/AnyFeature'
import { AppStateLink } from '../../../../components/App/AppStateLink'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'

const changeTitle = t`You can change this place's location on OpenStreetMap.`
const note = t`Please note that you need to log in to do this, and that it can take some time until the place is updated on Wheelmap.`
const optionEdit = t`Edit this place on OpenStreetMap`
const optionNote = t`Leave a note on OpenStreetMap`

const makeOSMEditUrl = (nodeId: string | number) => `https://www.openstreetmap.org/edit?node=${nodeId}`
const makeOSMNoteUrl = (coordinates?: {
  zoom: number,
  lon: number,
  lat: number
}) => {
  if (!coordinates) {
    return 'https://www.openstreetmap.org/note/new&layers=N'
  }

  const { zoom, lon, lat } = coordinates
  return `https://www.openstreetmap.org/note/new#map=${zoom}/${lon}/${lat}&layers=N`
}

const getPoint = (geometry: Polygon | Point | PointGeometry | MultiPolygon | undefined) => {
  if (!geometry) {
    return undefined
  }
  switch (geometry.type) {
  case 'Point':
      return geometry.coordinates
  case 'Polygon':
  case 'MultiPolygon':
      return center(geometry).geometry.coordinates
  default:
      return undefined
  }
}

export const ReportOSM: FC<{ title: string, subtitle?: string }> = ({ title, subtitle }) => {
  const { features } = useContext(FeaturePanelContext)

  const feature = features[0]

  if (!isOSMFeature(feature)) {
    throw new Error('Expected an OSM feature')
  }

  const coordinate = getPoint(feature.geometry)
  const osmNodeId = feature._id

  return (
    <StyledReportView>
      <StyledMarkdown className="_title">{title}</StyledMarkdown>
      { subtitle && <StyledMarkdown className="_subtitle">{subtitle}</StyledMarkdown> }
      <div className="_explanation">{note}</div>
      <a href={makeOSMEditUrl(osmNodeId)} rel="noreferrer" target="_blank"><div className="_option">{optionEdit}</div></a>
      <a
        href={makeOSMNoteUrl(coordinate ? {
          zoom: 19,
          lon: coordinate[1],
          lat: coordinate[0],
        } : undefined)}
        rel="noreferrer"
        target="_blank"
      >
        <div className="_option">{optionNote}</div>
      </a>
      <AppStateLink href="../report">
        <div className="_option _back">Back</div>
      </AppStateLink>
    </StyledReportView>
  )
}

function ReportOSMPosition() {
  return <ReportOSM title={changeTitle} />
}

ReportOSMPosition.getLayout = function getLayout(page: ReactElement) {
  return <PlaceLayout>{page}</PlaceLayout>
}

export default ReportOSMPosition
