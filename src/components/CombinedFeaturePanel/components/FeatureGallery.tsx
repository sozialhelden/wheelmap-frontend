import styled from 'styled-components'
import { FC } from 'react'
import useSWR from 'swr'
import { compact } from 'lodash'
import { AccessibilityCloudImage } from '../../../lib/model/ac/Feature'
import { AnyFeature, isOSMFeature, isPlaceInfo } from '../../../lib/model/geo/AnyFeature'
import { accessibilityCloudFeatureCache } from '../../../lib/legacy-caches/AccessibilityCloudFeatureCache'

const cacheLocation = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL ?? process.env.NEXT_PUBLIC_ACCESIBILITY_CLOUD_UNCACHED_BASE_URL
const appToken = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN
const context = ['osmGeometry', 'place', 'surveyResult'] as const

const fetcher = (urls: string[]) => {
  const f = (u) => fetch(u).then((r) => {
    if (r.ok) {
      return r.json() as Promise<ImageResponse>
    }

    throw new Error('Request failed')
  })
  return Promise.all(urls.flatMap(f))
}

interface ImageResponse {
  totalCount: number,
  images: AccessibilityCloudImage[]
}

const calculateDimensionsToFit = (acPhoto: AccessibilityCloudImage, maxSize: number) => {
  if (!acPhoto.dimensions) {
    return { width: maxSize, height: maxSize }
  }

  const { width, height } = acPhoto.dimensions
  const ratio = width / height
  if (width > height) {
    return {
      width: maxSize,
      height: Math.round(maxSize / ratio),
    }
  }
  return {
    width: Math.round(maxSize * ratio),
    height: maxSize,
  }
}

const makeSrcLocation = (image: AccessibilityCloudImage, size: number) => {
  const { width, height } = calculateDimensionsToFit(image, size)
  const angleFragment = image.angle ? `&angle=${((image.angle % 360) + 360) % 360}` : ''
  return `${cacheLocation}/images/scale/${image.imagePath}?fit=inside&fitw=${width}&fith=${height}${angleFragment}`
}

const makeCachedImageSrcSetEntry = (acPhoto: AccessibilityCloudImage, size: number) => ({
  src: makeSrcLocation(acPhoto, size),
  width: size,
  height: size,
})

const thumbnailSizes = [96, 192, 384]

// const fullScreenSizes = [480, 960, 1500]
// const fullScreenMediaSelector = [
//   '(min-width: 480px) 480px',
//   '(min-width: 960px) 960px',
//   '(min-width: 1500px) 1500px',
//   '960px',
// ]

const makeSrcSet = (sizes: number[], acPhoto: AccessibilityCloudImage) => sizes.map((s) => makeCachedImageSrcSetEntry(acPhoto, s))
const makeSrcSetLocation = (srcSet: ReturnType<typeof makeSrcSet>) => srcSet.map((x) => `${x.src} ${x.width}w`).join(',')

const makeImageLocation = (ctx: typeof context[number], id: string) => `${
  cacheLocation
}/images.json?context=${ctx}&objectId=${id}&appToken=${appToken}`

const Gallery = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;  
  gap: 4px;

  > .image {
    border-radius: 10px;
    width: 100%;
  }
`

const makeImageIds = (feature: AnyFeature): { context: typeof context[number], id: string }[] => {
  const combinations = compact([
    isOSMFeature(feature) && { context: 'place', id: feature._id.replace(/^way\//, '-').replace(/^node\//, '') } as const,
    isPlaceInfo(feature) && { context: 'place', id: feature._id } as const,
    isOSMFeature(feature) && { context: 'osmGeometry', id: `osm:${feature._id}` } as const,
    isPlaceInfo(feature)
      && feature.properties?.surveyResultId && { context: 'surveyResult', id: feature.properties.surveyResultId } as const,
  ] as const)
  return combinations
}

export const FeatureGallery: FC<{ feature: AnyFeature }> = ({ feature }) => {
  const ids = makeImageIds(feature)
  const { data } = useSWR(ids.map((x) => makeImageLocation(x.context, x.id)), fetcher)
  const images = data?.flatMap((x) => x.images)
  return (
    <Gallery>
      {images?.map((x) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={x._id}
          className="image"
          alt="A place"
          srcSet={makeSrcSetLocation(makeSrcSet(thumbnailSizes, x))}
        />
      ))}
    </Gallery>
  )
}
