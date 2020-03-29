// @flow

import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { t } from 'ttag';
import styled from 'styled-components';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';

import type { PhotoModel } from '../../../lib/PhotoModel';

import PhotoUploadButton from '../../PhotoUpload/PhotoUploadButton';
import PhotoNotification from '../../NodeToolbar/Photos/PhotoNotification';
import colors from '../../../lib/colors';

type Props = {
  featureId: string,
  className?: string,
  photoFlowNotification?: string,
  photoFlowErrorMessage: ?string,
  photos: PhotoModel[],
  onStartPhotoUploadFlow: () => void,
  onReportPhoto: (photo: PhotoModel) => void,
};

type State = {
  isLightboxOpen: boolean,
  thumbnailPhotos: PhotoModel[],
  currentImageIndex: number,
};

class PhotoHeader extends React.Component<Props, State> {
  state = {
    isLightboxOpen: false,
    thumbnailPhotos: [],
    currentImageIndex: 0,
  };

  gallery: Gallery | null = null;

  static getDerivedStateFromProps(props: Props, state: State): $Shape<State> {
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
    const PhotoHeaderDOMNode = findDOMNode(this.gallery);

    if (PhotoHeaderDOMNode instanceof Element) {
      PhotoHeaderDOMNode.setAttribute('tabindex', '0');
      PhotoHeaderDOMNode.addEventListener('keydown', this.PhotoHeaderSelectedWithKeyboard);
    }
  }

  componentWillUnmount() {
    const PhotoHeaderDOMNode = findDOMNode(this.gallery);

    if (PhotoHeaderDOMNode instanceof Element) {
      PhotoHeaderDOMNode.removeEventListener('keydown', this.PhotoHeaderSelectedWithKeyboard);
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

  PhotoHeaderSelectedWithKeyboard = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.thumbnailSelected(event, { index: 0 });
    }
  };

  thumbnailSelected = (event: UIEvent, obj: { index: number }) => {
    this.openLightbox(event, obj);
  };

  openLightbox = (event: UIEvent, obj: { index: number }) => {
    this.setState({
      currentImageIndex: obj.index,
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

  renderLightboxControls = (className: string) => {
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

    const PhotoHeaderEmpty = photos.length === 0;

    return (
      <section className={className}>
        <div className="image-strip" ref={g => (this.gallery = g)}>
          {thumbnailPhotos.map((photo, index) => (
            <img
              key={photo.imageId}
              srcSet={photo.srcSet}
              sizes={photo.sizes}
              src={photo.src}
              alt=""
              onClick={event => this.thumbnailSelected(event, { index: index })}
            />
          ))}
        </div>
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

        {PhotoHeaderEmpty && (
          <PhotoUploadButton
            onClick={onStartPhotoUploadFlow}
            textVisible={true}
            incentiveHintVisible={false}
          />
        )}

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

const StyledPhotoHeader = styled(PhotoHeader)`
  position: relative;
  padding: 0;
  min-height: 200px;
  background: linear-gradient(#eeeeee, #cccccc);

  ${({ photos }) =>
    photos.length === 0
      ? `
        display: flex;
        justify-content: center;
        align-items: center;
      `
      : `
        display: block;
        justify-content: initial;
        align-items: initial;
      `}

  ${PhotoUploadButton} {
    position: ${props => (props.photos.length > 0 ? 'absolute' : 'static')};
    right: ${props => (props.photos.length > 0 ? '0' : 'initial')};
  }

  .image-strip {
    display: flex;
    justify-content: center;
    overflow: hidden;

    &.focus-visible {
      border-radius: 0px;
      box-shadow: 0px 0px 0px 4px #4469e1;
    }

    img {
      height: 200px;
      flex-shrink: 0;
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
    background: transparent;
    min-height: initial;

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

export default StyledPhotoHeader;
