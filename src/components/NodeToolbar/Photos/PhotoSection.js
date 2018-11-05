// @flow

import * as React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';

import type { PhotoModel } from '../../../lib/PhotoModel';

import PhotoUploadButton from '../../PhotoUpload/PhotoUploadButton';
import PhotoNotification from '../../NodeToolbar/Photos/PhotoNotification';

type Props = {
  featureId: string,
  className: string,
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

class PhotoSection extends React.Component<Props, State> {
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
      return clone;
    });

    return { thumbnailPhotos };
  }

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
        <button
          disabled={!canReportPhoto}
          onClick={this.reportImage}
          className="report-image"
        >{t`Report image`}</button>
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
    }
  }

  /* lazy workaround for Lightbox putting its nodes higher up in the dom */
  &.lightbox-actions {
    position: absolute;
    width: 100%;
    /* Use same height as lightbox pagination */
    height: 40px;
    bottom: 0;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;

    button {
      margin-top: 0.25rem;
      font-size: 0.9rem;
      font-weight: bold;
      color: white;
      background: none;
      border: none;
      cursor: pointer;
      text-shadow: 0 1px 1px black;

      /* Don't show button if you cannot interact with it */
      &[disabled] {
        display: none;
      }
    }
  }
`;

export default StyledPhotoSection;
