/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @next/next/no-img-element */
import styled from 'styled-components'
import {
  FC, useContext, useEffect, useMemo, useState,
} from 'react'
import useSWR from 'swr'
import { t } from 'ttag'
import { useRouter } from 'next/router'
import { AccessibilityCloudImage } from '../../../lib/model/ac/Feature'
import { AnyFeature } from '../../../lib/model/geo/AnyFeature'
import colors from '../../../lib/util/colors'
import { Camera } from '../../icons/actions'
import { AppStateLink } from '../../App/AppStateLink'
import { FeaturePanelContext } from '../FeaturePanelContext'
import { cx } from '../../../lib/util/cx'
import { StyledGallery } from './Gallery/Gallery'
import {
  makeImageIds, makeImageLocation, makeSrcSet, makeSrcSetLocation, thumbnailSizes,
} from './Gallery/util'
import { GalleryOverlay } from './Gallery/GalleryOverlay'
import { GalleryCallToAction } from './Gallery/GalleryCallToAction'

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

const AddImageRow = styled.button`
  width: 100%;
  padding: 1em 0.5em;
  margin-top: 0.5em;
  background-color: ${colors.coldBackgroundColor};
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  color: ${colors.linkColor};
  font-size: 16px;
  border: none;

  &:hover {
    background-color: ${colors.linkBackgroundColor}
  }

  > svg {
    width: 2em;
    height: 2em;
    margin-right: 0.5em;

  }
`

export const FeatureGallery: FC<{ feature: AnyFeature, focusImage?: string }> = ({ feature, focusImage }) => {
  const ids = makeImageIds(feature)
  const router = useRouter()
  const { data } = useSWR(ids.map((x) => makeImageLocation(x.context, x.id)), fetcher)
  const images = useMemo(() => data?.flatMap((x) => x.images) ?? [], [data])
  const { baseFeatureUrl } = useContext(FeaturePanelContext)

  const [open, setOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(-1)

  useEffect(() => {
    if (focusImage === undefined) {
      return
    }
    const idx = images.findIndex((x) => x._id === focusImage)
    setGalleryIndex(idx)
  }, [focusImage, images])

  return (
    <>
      <GalleryOverlay
        images={images ?? []}
        openIndex={galleryIndex}
        setGalleryIndex={(number) => {
          if (number < 0) {
            router.push(`/${feature._id}`)
            return
          }
          const image = images[number]
          router.push(`/${feature._id}/images/${image._id}`, undefined, { shallow: true })
        }}
      />
      <StyledGallery className={cx(open && 'open')}>
        <div className="images">
          {images.map((x) => (
            <AppStateLink href={`/${feature._id}/images/${x._id}`}>
              <img
                key={x._id}
                className="image"
                srcSet={makeSrcSetLocation(makeSrcSet(thumbnailSizes, x))}
              />
            </AppStateLink>
          ))}
        </div>
        {
          images.length > 2 && (
            <div className="wrapper">
              <button type="button" className="foldout" onClick={() => setOpen(!open)}>{ open ? t`Less` : t`More` }</button>
            </div>
          )
        }
      </StyledGallery>

      <AppStateLink href={`${baseFeatureUrl}/images/upload`}>
        <AddImageRow>
          <Camera />
          {t`Add Image`}
          <GalleryCallToAction />
        </AddImageRow>
      </AppStateLink>
    </>
  )
}
