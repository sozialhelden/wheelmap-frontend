import * as React from 'react';
import Lightbox, { Modal, ModalGateway } from 'react-images';
import PhotoAlbum from 'react-photo-album';
import styled, { createGlobalStyle } from 'styled-components';
import { t } from 'ttag';

import { PhotoModel } from '../../../lib/PhotoModel';

import { maxBy } from 'lodash';
import PhotoNotification from '../../NodeToolbar/Photos/PhotoNotification';
import PhotoUploadButton from '../../PhotoUpload/PhotoUploadButton';

type Props = {
  featureId: string;
  className?: string;
  photoFlowNotification?: 'uploadProgress' | 'uploadFailed' | 'reported' | 'waitingForReview';
  photoFlowErrorMessage: string | null;
  photos: PhotoModel[];
  onStartPhotoUploadFlow: () => void;
  onReportPhoto: (photo: PhotoModel) => void;
  onLightbox: (isOpen: boolean) => void;
};

const GlobalLightboxStyles = createGlobalStyle`
  .react-images__header {
    margin-top: 0;
    opacity: 1 !important;
  }

  .react-images__footer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
    opacity: 1 !important;
  }
`;

function flipPhotoDimensions(photo: PhotoModel) {
  const needsFlip = photo.angle && photo.angle % 180 !== 0;
  return {
    ...photo,
    height: needsFlip ? photo.width : photo.height,
    width: needsFlip ? photo.height : photo.width,
  };
}

function PhotoSection(props: Props) {
  const { photoFlowNotification, onStartPhotoUploadFlow, photos: rawPhotos, className, onLightbox, onReportPhoto } = props;

  const photos = rawPhotos.map(photo =>
    photo.angle % 180 === 0 ? photo : flipPhotoDimensions(photo)
  );
  const hasPhotos = photos.length > 0;

  const [isLightboxOpen, setIsLightboxOpen] = React.useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  React.useEffect(() => {
    onLightbox(isLightboxOpen);
  }, [isLightboxOpen, onLightbox]);

  const showImage = React.useCallback((_event, _photo, index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = React.useCallback(() => {
    setCurrentImageIndex(0);
    setIsLightboxOpen(false);
  }, []);

  const reportImage = React.useCallback(() => {
    if (currentImageIndex < 0 || currentImageIndex >= photos.length) {
      console.error('Could not report photo with index', currentImageIndex);
      return;
    }
    const toBeReported = photos[currentImageIndex];
    onReportPhoto(toBeReported);
  }, [photos, currentImageIndex, onReportPhoto]);

  const gotoPrevious = React.useCallback(() => {
    setCurrentImageIndex(currentImageIndex - 1);
  }, [currentImageIndex]);

  const gotoNext = React.useCallback(() => {
    setCurrentImageIndex(currentImageIndex + 1);
  }, [currentImageIndex]);

  const canReportPhoto =
    currentImageIndex >= 0 &&
    currentImageIndex < photos.length &&
    photos?.[currentImageIndex].appSource === 'accessibility-cloud';

  const FooterCaption = React.useMemo(() => {
    return () => (
      <section key="lightbox-actions" className={`lightbox-actions ${className}`}>
        <div>
          <kbd>esc</kbd>
          <kbd className={currentImageIndex === 0 ? 'disabled' : ''}>←</kbd>
          <kbd className={currentImageIndex === photos.length - 1 ? 'disabled' : ''}>→</kbd>
        </div>

        {canReportPhoto && (
          <button onClick={reportImage} className="report-image">{t`Report image`}</button>
        )}
      </section>
    );
  }, [canReportPhoto, currentImageIndex, photos, reportImage, className]);

  const FooterCount = React.useMemo(() => {
    // translator: divider between <currentImageIndex> and <imageCount> in lightbox, such as 1 of 10
    const separator = t`of`;
    return () => (
      <span>
        <span>{currentImageIndex + 1}</span>&nbsp;<span>{separator}</span>&nbsp;
        <span>{photos.length}</span>
      </span>
    );
  }, [currentImageIndex, photos]);

  const HeaderFullscreen = React.useMemo(() => () => <span></span>, []);

  const photoViewingComponents = hasPhotos && (
    <>
      <PhotoAlbum
        photos={photos.map(p => ({ ...p }))}
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
              views={photos.map(p => ({
                ...p,
                src: maxBy(p.images, mp => Math.max(mp.width, mp.height))?.src,
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
              showNavigationOnTouchDevice={true}
            />
          </Modal>
        )}
      </ModalGateway>
    </>
  );

  const photoUploadComponents = (
    <>
      <PhotoUploadButton onClick={onStartPhotoUploadFlow} />

      {photoFlowNotification && (
        <PhotoNotification
          notificationType={photoFlowNotification}
          photoFlowErrorMessage={props.photoFlowErrorMessage}
        />
      )}
    </>
  );

  return (
    <section className={className}>
      {photoViewingComponents}
      {photoUploadComponents}
    </section>
  );
}

const StyledPhotoSection = styled(PhotoSection)`
  margin: 0.5rem -1rem;
  padding: 0;

  .react-photo-album--photo {
    object-fit: cover;
    object-position: bottom;
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
      border: 1px solid grey;
      cursor: pointer;
      text-shadow: 0 1px 1px black;
      border-radius: 4px;
      padding: 0.2rem 0.5rem;
      font-size: 0.875rem;
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
`;

export default StyledPhotoSection;
