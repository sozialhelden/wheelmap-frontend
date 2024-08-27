import * as React from 'react'
import Lightbox, { Modal, ModalGateway } from 'react-images'
import PhotoAlbum from 'react-photo-album'
import styled, { createGlobalStyle } from 'styled-components'
import { t } from 'ttag'

import { maxBy } from 'lodash'
import Link from 'next/link'
import useSWR from 'swr'
import { PhotoModel } from '../../../lib/model/ac/PhotoModel'
import { useCurrentAppToken } from '../../../lib/context/AppContext'
import { fetchImagesCached } from '../../../lib/fetchers/fetchACImages'
import convertAcPhotosToLightboxPhotos from '../../../lib/model/ac/convertAcPhotosToLightboxPhotos'
import PhotoUploadButton from './PhotoUpload/PhotoUploadButton'

type Props = {
  entityType: string,
  entityId: string,
};

const GlobalLightboxStyles = createGlobalStyle`
  .react-images__header {
    margin-top: 0;
    margin-top: env(safe-area-inset-top);
  }

  .react-images__footer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
    margin-bottom: env(safe-area-inset-bottom);
  }
`

function flipPhotoDimensions(photo: PhotoModel) {
  const needsFlip = photo.angle && photo.angle % 180 !== 0
  return {
    ...photo,
    height: needsFlip ? photo.width : photo.height,
    width: needsFlip ? photo.height : photo.width,
  }
}

const StyledSection = styled.section`
  margin: 0.5rem -1rem;
  padding: 0;

  .react-photo-album--photo {
    object-fit: cover;
  }

  /* lazy workaround for Lightbox putting its nodes higher up in the dom */
  &.lightbox-actions {
    /* Use same height and positioning as lightbox pagination */
    height: 30px;
    margin: 0;
    padding: 5px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    button {
      font-weight: bold;
      color: white;
      background: none;
      border: none;
      cursor: pointer;
      text-shadow: 0 1px 1px black;
      padding: 0.2rem 0.5rem;
      font-size: 1rem;
    }

    kbd {
      font-size: 18px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu,
        Cantarell, 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
      &.disabled {
        opacity: 0.5;
      }
    }
  }
`

export default function PhotoSection(props: Props) {
  const { entityId, entityType } = props
  const appToken = useCurrentAppToken()

  // Only support 'place' context for now
  const context = {
    node: 'place',
    way: 'place',
    relation: 'place',
    nodes: 'place',
  }[entityType] || 'place'

  const { data: rawPhotos, isValidating, error } = useSWR([appToken, context, entityId], fetchImagesCached)

  const photos = rawPhotos?.map(convertAcPhotosToLightboxPhotos)
    .map((photo) => (photo.angle % 180 === 0 ? photo : flipPhotoDimensions(photo)))
  const hasPhotos = photos?.length > 0

  const [isLightboxOpen, setIsLightboxOpen] = React.useState<boolean>(false)
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const currentImage = React.useMemo(() => photos?.[currentImageIndex], [currentImageIndex, photos])

  const showImage = React.useCallback((_event, _photo, index) => {
    setCurrentImageIndex(index)
    setIsLightboxOpen(true)
  }, [])

  const closeLightbox = React.useCallback(() => {
    setCurrentImageIndex(0)
    setIsLightboxOpen(false)
  }, [])

  const gotoPrevious = React.useCallback(() => {
    setCurrentImageIndex(currentImageIndex - 1)
  }, [currentImageIndex])

  const gotoNext = React.useCallback(() => {
    setCurrentImageIndex(currentImageIndex + 1)
  }, [currentImageIndex])

  const canReportPhoto = currentImage?.appSource === 'accessibility-cloud'

  const FooterCaption = React.useMemo(() => function () {
    return (
      <section key="lightbox-actions" className="lightbox-actions">
        <div>
          <kbd>esc</kbd>
          <kbd className={currentImageIndex === 0 ? 'disabled' : ''}>←</kbd>
          <kbd className={currentImageIndex === photos.length - 1 ? 'disabled' : ''}>→</kbd>
        </div>
        {canReportPhoto && (
          <Link
            href={`/${entityType}/${entityId}/images/${currentImage?._id}/report`}
            legacyBehavior
          >
            <button className="report-image">{t`Report image`}</button>
          </Link>
        )}
      </section>
    )
  }, [entityType, entityId, currentImage, canReportPhoto, currentImageIndex, photos])

  const FooterCount = React.useMemo(() => {
    // translator: divider between <currentImageIndex> and <imageCount> in lightbox, such as 1 of 10
    const separator = t`of`
    return function () {
      return (
        <span>
          <span>{currentImageIndex + 1}</span>
&nbsp;
          <span>{separator}</span>
&nbsp;
          <span>{photos.length}</span>
        </span>
      )
    }
  }, [currentImageIndex, photos])

  const HeaderFullscreen = React.useMemo(() => function () {
    return <span />
  }, [])

  // const customStyles = {
  //   header: (base, state) => ({
  //     ...base,
  //     borderBottom: '1px dotted pink',
  //     color: state.isFullscreen ? 'red' : 'blue',
  //     padding: 20,
  //   }),
  //   view: () => ({
  //     // none of react-images styles are passed to <View />
  //     height: 400,
  //     width: 600,
  //   }),
  //   footer: (base, state) => {
  //     const opacity = state.interactionIsIdle ? 0 : 1;
  //     const transition = 'opacity 300ms';

  //     return { ...base, opacity, transition };
  //   }
  // }

  const photoViewingComponents = hasPhotos && (
    <>
      <PhotoAlbum
        photos={photos.map((p) => ({ ...p, width: 100, height: 100 }))}
        onClick={showImage}
        columns={Math.min(photos.length, 3)}
        layout="columns"
      />

      {isLightboxOpen && <GlobalLightboxStyles />}

      <ModalGateway>
        {isLightboxOpen && (
          <Modal onClose={closeLightbox}>
            <Lightbox
              components={{ FooterCaption, FooterCount, HeaderFullscreen }}
              views={photos.map((p) => ({
                ...p,
                src: maxBy(p.images, (mp) => Math.max(mp.width, mp.height))?.src,
              }))}
              onClose={closeLightbox}
              onClickPrev={gotoPrevious}
              onClickNext={gotoNext}
              currentIndex={currentImageIndex}
              // translator: alt info on next image button in lightbox
              rightArrowTitle={t`Next (right arrow key)`}
              // translator: alt info on previous image button in lightbox
              leftArrowTitle={t`Previous (left arrow key)`}
              // translator: alt info on close button in lightbox
              closeButtonTitle={t`Close (Esc)`}
              // Use same alignment as report button
              theme={{ footer: { alignItems: 'center' } }}
              allowFullscreen={false}
              showNavigationOnTouchDevice
            />
          </Modal>
        )}
      </ModalGateway>
    </>
  )

  return (
    <StyledSection>
      {photoViewingComponents}
      <Link href={`/${entityType}/${entityId}/images/upload`} legacyBehavior>
        <PhotoUploadButton />
      </Link>
    </StyledSection>
  )
}
