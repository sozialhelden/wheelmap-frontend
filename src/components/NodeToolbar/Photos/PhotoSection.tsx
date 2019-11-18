import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { t } from 'ttag';
import styled from 'styled-components';
import Gallery, { PhotoClickHandler, GalleryProps } from 'react-photo-gallery';
import Lightbox from 'react-images';

import { PhotoModel } from '../../../lib/PhotoModel';

import PhotoUploadButton from '../../PhotoUpload/PhotoUploadButton';
import PhotoNotification from '../../NodeToolbar/Photos/PhotoNotification';

type Props = {
  featureId: string,
  className?: string,
  photoFlowNotification?: 'uploadProgress' | 'uploadFailed' | 'reported' | 'waitingForReview',
  photoFlowErrorMessage: string | null,
  photos: PhotoModel[],
  onStartPhotoUploadFlow: () => void,
  onReportPhoto: (photo: PhotoModel) => void,
};

type State = {
  isLightboxOpen: boolean,
  thumbnailPhotos: PhotoModel[],
  currentImageIndex: number,
};

class PhotoSection extends React.Component<Props, State> {
  state = {
    isLightboxOpen: false,
    thumbnailPhotos: [],
    currentImageIndex: 0,
  };

  gallery: React.Component<GalleryProps> | null = null;

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> {
    const { photos } = props;

    const thumbnailPhotos = photos.map(p => {
      var clone = Object.assign({}, p, {
        srcSet: p.thumbnailSrcSet || p.srcSet,
        sizes: p.thumbnailSizes || p.sizes,
      });
      delete clone.imageId;
      delete clone.thumbnailSrcSet;
      delete clone.thumbnailSizes;
      return clone;
    });

    return { thumbnailPhotos };
  }

  componentDidMount() {
    // This manual event handling is necessary, because the lib react-gallery
    // does not offer a keyDown API and only works with clicks.
    // In order to make it keyboard-focusable and operable with the 'Enter' key,
    // we add this functionality directly on the DOM node.
    const photoSectionDOMNode = findDOMNode(this.gallery);

    if (photoSectionDOMNode instanceof Element) {
      photoSectionDOMNode.setAttribute('tabindex', '0');
      photoSectionDOMNode.addEventListener('keydown', this.photoSectionSelectedWithKeyboard);
    }
  }

  componentWillUnmount() {
    const photoSectionDOMNode = findDOMNode(this.gallery);

    if (photoSectionDOMNode instanceof Element) {
      photoSectionDOMNode.removeEventListener('keydown', this.photoSectionSelectedWithKeyboard);
    }

    window.removeEventListener('keydown', this.preventTabbing);
  }

  componentDidUpdate(_, prevState) {
    if (!prevState.isLightboxOpen && this.state.isLightboxOpen) {
      window.addEventListener('keydown', this.preventTabbing);
    } else if (prevState.isLightboxOpen && !this.state.isLightboxOpen) {
      window.removeEventListener('keydown', this.preventTabbing);
    }
  }

  preventTabbing(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.keyCode === 9) {
      event.preventDefault();
    }
  }

  photoSectionSelectedWithKeyboard = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.openLightbox(0);
    }
  };

  thumbnailSelected: PhotoClickHandler<{}> = (event, obj: { index: number }) => {
    this.openLightbox(obj.index);
  };

  openLightbox = (index: number) => {
    this.setState({
      currentImageIndex: index,
      isLightboxOpen: true,
    });
  };

  closeLightbox = () => {
    this.setState({
      currentImageIndex: 0,
      isLightboxOpen: false,
    });
  };

  reportImage = () => {
    const { photos } = this.props;
    const { currentImageIndex } = this.state;

    if (currentImageIndex < 0 || currentImageIndex >= photos.length) {
      console.error('Could not report photo with index', currentImageIndex);
      return;
    }
    const toBeReported = photos[currentImageIndex];
    this.props.onReportPhoto(toBeReported);
  };

  gotoPrevious = () => {
    this.setState({
      currentImageIndex: this.state.currentImageIndex - 1,
    });
  };

  gotoNext = () => {
    this.setState({
      currentImageIndex: this.state.currentImageIndex + 1,
    });
  };

  renderLightboxControls: any = (className: string) => {
    const { photos } = this.props;
    const { currentImageIndex } = this.state;

    let canReportPhoto = false;
    if (currentImageIndex >= 0 && currentImageIndex < photos.length) {
      canReportPhoto = photos[currentImageIndex].source === 'accessibility-cloud';
    }

    return [
      <section key="lightbox-actions" className={`lightbox-actions ${className}`}>
        <div>
          <kbd>esc</kbd>
          <kbd className={currentImageIndex === 0 ? 'disabled' : ''}>←</kbd>
          <kbd className={currentImageIndex === photos.length - 1 ? 'disabled' : ''}>→</kbd>
        </div>

        {canReportPhoto && (
          <button onClick={this.reportImage} className="report-image">{t`Report image`}</button>
        )}
      </section>,
    ];
  };

  render() {
    const { photoFlowNotification, onStartPhotoUploadFlow, photos, className } = this.props;
    const { thumbnailPhotos, currentImageIndex } = this.state;

    return (
      <section className={className}>
        <Gallery
          ref={g => (this.gallery = g)}
          photos={thumbnailPhotos}
          onClick={this.thumbnailSelected}
          columns={Math.min(photos.length, 3)}
        />
        <Lightbox
          images={photos}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={currentImageIndex}
          isOpen={this.state.isLightboxOpen}
          // translator: divider between <currentImageIndex> and <imageCount> in lightbox, such as 1 of 10
          imageCountSeparator={' ' + t`of` + ' '}
          // translator: alt info on next image button in lightbox
          rightArrowTitle={t`Next (right arrow key)`}
          // translator: alt info on previous image button in lightbox
          leftArrowTitle={t`Previous (left arrow key)`}
          // translator: alt info on close button in lightbox
          closeButtonTitle={t`Close (Esc)`}
          customControls={this.renderLightboxControls(className)}
          // Use same alignment as report button
          theme={{ footer: { alignItems: 'center' } }}
        />

        <PhotoUploadButton onClick={onStartPhotoUploadFlow} />

        {photoFlowNotification && (
          <PhotoNotification
            notificationType={photoFlowNotification}
            photoFlowErrorMessage={this.props.photoFlowErrorMessage}
          />
        )}
      </section>
    );
  }
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
