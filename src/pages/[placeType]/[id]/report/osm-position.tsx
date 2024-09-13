import { useRouter } from 'next/router'
import { ReactElement, useRef } from 'react'
import { t } from 'ttag'
import Link from 'next/link'
import { center } from '@turf/turf'
import { PointGeometry } from '@sozialhelden/a11yjson'
import { MultiPolygon, Point, Polygon } from 'geojson'
import MapLayout from '../../../../components/App/MapLayout'
import { useMultipleFeatures } from '../../../../lib/fetchers/fetchMultipleFeatures'
import FeatureNameHeader from '../../../../components/CombinedFeaturePanel/components/FeatureNameHeader'
import FeatureImage from '../../../../components/CombinedFeaturePanel/components/image/FeatureImage'
import { ErrorToolBar, LoadingToolbar, StyledToolbar } from '.'

const title = t`You can change this place's location on OpenStreetMap.`
const subtitle = t`Please note that you need to log in to do this, and that it can take some time until the place is updated on Wheelmap.`
const optionEdit = t`Edit this place on OpenStreetMap`
const optionNote = t`Leave a note on OpenStreetMap`

const makeOSMEditUrl = (nodeId: string | number) => `https://www.openstreetmap.org/edit?node=${nodeId}`
const makeOSMNoteUrl = ({ zoom, lon, lat }: {
  zoom: number,
  lon: number,
  lat: number
}) => `https://www.openstreetmap.org/note/new#map=${zoom}/${lon}/${lat}&layers=N`

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

function ReportOSMPosition() {
  const router = useRouter()
  const { placeType, id } = router.query

  const osmNodeId = typeof id === 'string' ? id.replace('node:', '') : undefined
  const features = useMultipleFeatures(`${placeType}:${id}`)
  const featurette = features && features.data ? features.data : undefined
  const feat = featurette ? featurette[0] : undefined

  const ref = useRef(null)
  const coordinate = getPoint(feat?.geometry)

  if (features.isLoading || features.isValidating) {
    return <LoadingToolbar />
  }

  if (!feat || osmNodeId === undefined || !coordinate) {
    return <ErrorToolBar />
  }

  return (
    <StyledToolbar innerRef={ref}>
      <FeatureNameHeader feature={feat}>
        {feat['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feat} />
        )}
      </FeatureNameHeader>
      <div className="_title">{title}</div>
      <div className="_subtitle">{subtitle}</div>
      <a href={makeOSMEditUrl(osmNodeId)} rel="noreferrer" target="_blank"><div className="_option">{optionEdit}</div></a>
      <a
        href={makeOSMNoteUrl({
          zoom: 19,
          lon: coordinate[1],
          lat: coordinate[0],
        })}
        rel="noreferrer"
        target="_blank"
      >
        <div className="_option">{optionNote}</div>
      </a>
      <Link href={{
        pathname: '../report',
        query: { placeType, id },
      }}
      >
        <div className="_option _back">Back</div>
      </Link>
    </StyledToolbar>
  )
}

ReportOSMPosition.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}

export default ReportOSMPosition
