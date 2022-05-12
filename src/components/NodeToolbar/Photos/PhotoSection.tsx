import * as React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';
import Lightbox, { Modal, ModalGateway } from 'react-images';
import PhotoAlbum from "react-photo-album";

import { PhotoModel } from '../../../lib/PhotoModel';

import PhotoUploadButton from '../../PhotoUpload/PhotoUploadButton';
import PhotoNotification from '../../NodeToolbar/Photos/PhotoNotification';
import { maxBy } from 'lodash';

type Props = {
  featureId: string,
  className?: string,
  photoFlowNotification?: 'uploadProgress' | 'uploadFailed' | 'reported' | 'waitingForReview',
  photoFlowErrorMessage: string | null,
  photos: PhotoModel[],
  onStartPhotoUploadFlow: () => void,
  onReportPhoto: (photo: PhotoModel) => void,
};

function PhotoSection(props: Props) {
  const { photoFlowNotification, onStartPhotoUploadFlow, photos, className } = props;

  const [isLightboxOpen, setIsLightboxOpen] = React.useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // componentDidMount() {
  //   // This manual event handling is necessary, because the lib react-gallery
  //   // does not offer a keyDown API and only works with clicks.
  //   // In order to make it keyboard-focusable and operable with the 'Enter' key,
  //   // we add this functionality directly on the DOM node.
  //   const photoSectionDOMNode = findDOMNode(gallery);

  //   if (photoSectionDOMNode instanceof Element) {
  //     photoSectionDOMNode.setAttribute('tabindex', '0');
  //     photoSectionDOMNode.addEventListener('keydown', photoSectionSelectedWithKeyboard);
  //   }
  // }

  // componentWillUnmount() {
  //   const photoSectionDOMNode = findDOMNode(gallery);

  //   if (photoSectionDOMNode instanceof Element) {
  //     photoSectionDOMNode.removeEventListener('keydown', photoSectionSelectedWithKeyboard);
  //   }

  //   window.removeEventListener('keydown', preventTabbing);
  // }

  // componentDidUpdate(_, prevState) {
  //   if (!previsLightboxOpen && isLightboxOpen) {
  //     window.addEventListener('keydown', preventTabbing);
  //   } else if (previsLightboxOpen && !isLightboxOpen) {
  //     window.removeEventListener('keydown', preventTabbing);
  //   }
  // }

  // preventTabbing(event: KeyboardEvent) {
  //   if (event.key === 'Tab' || event.keyCode === 9) {
  //     event.preventDefault();
  //   }
  // }

  const photoSectionSelectedWithKeyboard = React.useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      setCurrentImageIndex(0);
      setIsLightboxOpen(true);
    }
  }, []);

  const thumbnailSelected = React.useCallback((obj) => {
    setCurrentImageIndex(obj.index);
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
    props.onReportPhoto(toBeReported);
  }, [photos, currentImageIndex]);

  const gotoPrevious = React.useCallback(() => {
    setCurrentImageIndex(currentImageIndex - 1);
  }, [currentImageIndex]);

  const gotoNext = React.useCallback(() => {
    setCurrentImageIndex(currentImageIndex + 1);
  }, [currentImageIndex]);

  const canReportPhoto = React.useMemo(() => {
    if (currentImageIndex >= 0 && currentImageIndex < photos.length) {
      return photos?.[currentImageIndex].source === 'accessibility-cloud';
    }
    return false;
  }, [currentImageIndex, photos]);

  const lightboxControls =
      <section key="lightbox-actions" className={`lightbox-actions ${className}`}>
        <div>
          <kbd>esc</kbd>
          <kbd className={currentImageIndex === 0 ? 'disabled' : ''}>←</kbd>
          <kbd className={currentImageIndex === photos.length - 1 ? 'disabled' : ''}>→</kbd>
        </div>

        {canReportPhoto && (
          <button onClick={reportImage} className="report-image">{t`Report image`}</button>
        )}
      </section>;


  if (!photos.length) {
    return null;
  }

  return (
    <section className={className}>
      <PhotoAlbum
        photos={photos}
        onClick={thumbnailSelected}
        columns={Math.min(photos.length, 3)}
        layout="masonry"
      />
      <ModalGateway>
        {isLightboxOpen && <Modal onClose={closeLightbox}>
          <Lightbox
            views={photos.map(p => ({ ...p, src: maxBy(photos, mp => Math.max(mp.width, mp.height))?.src }))}
            onClose={closeLightbox}
            onClickPrev={gotoPrevious}
            onClickNext={gotoNext}
            currentImage={currentImageIndex}
            // translator: divider between <currentImageIndex> and <imageCount> in lightbox, such as 1 of 10
            imageCountSeparator={' ' + t`of` + ' '}
            // translator: alt info on next image button in lightbox
            rightArrowTitle={t`Next (right arrow key)`}
            // translator: alt info on previous image button in lightbox
            leftArrowTitle={t`Previous (left arrow key)`}
            // translator: alt info on close button in lightbox
            closeButtonTitle={t`Close (Esc)`}
            customControls={lightboxControls}
            // Use same alignment as report button
            theme={{ footer: { alignItems: 'center' } }}
          />
        </Modal>}
      </ModalGateway>

      <PhotoUploadButton onClick={onStartPhotoUploadFlow} />

      {photoFlowNotification && (
        <PhotoNotification
          notificationType={photoFlowNotification}
          photoFlowErrorMessage={props.photoFlowErrorMessage}
        />
      )}
    </section>
  );
}

const StyledPhotoSection = styled(PhotoSection)`
  margin: 0.5rem -1rem;
  padding: 0;

  .react-photo-gallery--gallery {
    img {
      object-fit: contain;
      max-height: 150px;
      image-orientation: from-image;
    }
  }

  /* lazy workaround for Lightbox putting its nodes higher up in the dom */
  &.lightbox-actions {
    position: absolute;
    width: 100%;
    /* Use same height and positioning as lightbox pagination */
    height: 30px;
    bottom: 0;
    margin: 0;
    padding: 5px 0;
    display: flex;
    justify-content: flex-start;

    button {
      font-size: 0.9rem;
      font-weight: bold;
      color: white;
      background: none;
      border: none;
      cursor: pointer;
      text-shadow: 0 1px 1px black;
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
