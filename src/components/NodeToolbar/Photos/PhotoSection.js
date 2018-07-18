// @flow

import * as React from 'react';
import { t } from 'c-3po';
import styled from 'styled-components';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';

import { wheelmapFeaturePhotosCache } from '../../../lib/cache/WheelmapFeaturePhotosCache';
import convertWheelmapPhotosToLightboxPhotos from './convertWheelmapPhotosToLightboxPhotos';
import type { WheelmapFeaturePhotos } from '../../../lib/Feature';

import { accessibilityCloudImageCache } from '../../../lib/cache/AccessibilityCloudImageCache';
import convertAcPhotosToLightboxPhotos from './convertAcPhotosToLightboxPhotos';
import type { AccessibilityCloudImages } from '../../../lib/Feature';

import type { PhotoModel } from './PhotoModel';

import PhotoUploadButton from '../../PhotoUpload/PhotoUploadButton';
import PhotoNotification from '../../NodeToolbar/Photos/PhotoNotification';
import colors from '../../../lib/colors';

type Props = {
  featureId: string,
  className: string,
  photoFlowNotification?: string;
  onStartPhotoUploadFlow: () => void;
  onReportPhoto: (photo: PhotoModel) => void;
};

type State = {
  isLightboxOpen: boolean,
  acPhotos: PhotoModel[],
  wmPhotos: PhotoModel[],
  photos: PhotoModel[],
  lightBoxPhotos: PhotoModel[],
  currentImageIndex: number,
};

class PhotoSection extends React.Component<Props, State> {
  state = {
    isLightboxOpen: false,
    acPhotos: [],
    wmPhotos: [],
    photos: [],
    lightBoxPhotos: [],
    currentImageIndex: 0,
  };

  gallery: Gallery | null = null;

  componentDidMount() {
    this.fetchPhotos(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.featureId !== this.props.featureId) {
      this.fetchPhotos(nextProps);
      this.setState({ photos: [], lightBoxPhotos: [], acPhotos: [], wmPhotos: [] });
    }
  }

  combinePhotoSources = () => {
    const mergedPhotos = ([]).concat(this.state.acPhotos, this.state.wmPhotos);

    this.setState({ lightBoxPhotos: [].concat(mergedPhotos) });

    let galleryPhotos = [];
    if (mergedPhotos.length > 0) {
      // use the thumbnail sizes for this
      galleryPhotos = mergedPhotos.map(p => {
        return Object.assign({}, p, { srcSet: p.thumbnailSrcSet || p.srcSet, sizes: p.thumbnailSizes || p.sizes });
      });
    }

    this.setState({ photos: galleryPhotos }, () => {
      const g : any = (this.gallery);
      g.handleResize();
    });
  }

  handlePhotoError = (e) => {
    // TODO decide to do something
    console.error("Failed downloading images", e);
  }

  fetchPhotos(props: Props) {
    if (props.featureId) {
      accessibilityCloudImageCache
        .getPhotosForFeature(props.featureId)
        .then((acPhotos: AccessibilityCloudImages) => {
          const photos = convertAcPhotosToLightboxPhotos(acPhotos);
          this.setState({ acPhotos: photos }, this.combinePhotoSources);
        }).catch(this.handlePhotoError);

      wheelmapFeaturePhotosCache
        .getPhotosForFeature(props.featureId)
        .then((wmPhotos: WheelmapFeaturePhotos) => {
          const photos = convertWheelmapPhotosToLightboxPhotos(wmPhotos);
          this.setState({ wmPhotos: photos }, this.combinePhotoSources);
        }).catch(this.handlePhotoError);
    }
  }

  thumbnailSelected = (event: UIEvent, obj: { index: number }) => {
    // the last element is always the upload photo element
    if (obj.index === this.state.photos.length - 1) {
      this.props.onStartPhotoUploadFlow();
    } else {
      this.openLightbox(event, obj);
    }
  }

  openLightbox = (event: UIEvent, obj: { index: number }) => {
    this.setState({
      currentImageIndex: obj.index,
      isLightboxOpen: true,
    });
  }

  closeLightbox = () => {
    this.setState({
      currentImageIndex: 0,
      isLightboxOpen: false,
    });
  }  
  
  reportImage = () => {
    const { lightBoxPhotos, currentImageIndex } = this.state;

    if (currentImageIndex < 0 || currentImageIndex >= lightBoxPhotos.length ) {
      console.error("Could not report photo with index", currentImageIndex);
      return;
    }
    const toBeReported = lightBoxPhotos[currentImageIndex];
    this.props.onReportPhoto(toBeReported);
  }

  gotoPrevious = () => {
    this.setState({
      currentImageIndex: this.state.currentImageIndex - 1,
    });
  }

  gotoNext = () => {
    this.setState({
      currentImageIndex: this.state.currentImageIndex + 1,
    });
  }

  renderLightboxControls = (className: string) => {
    const { lightBoxPhotos, currentImageIndex } = this.state;

    let canReportPhoto = false;
    if (currentImageIndex >= 0 && currentImageIndex < lightBoxPhotos.length ) {
      canReportPhoto = lightBoxPhotos[currentImageIndex].source === 'accessibility-cloud';
    }

    return [(
      <section key='lightbox-actions' className={`lightbox-actions ${className}`}>
        <button disabled={!canReportPhoto} onClick={this.reportImage} className="report-image">{t`Report`}</button>
        <button onClick={this.closeLightbox} className="close-lightbox">{t`Close`}</button>
      </section>
    )];
  }

  render() {
    const hasPhotos = this.state.photos.length > 0;
    const { photoFlowNotification, onStartPhotoUploadFlow, className } = this.props;
    const { photos, lightBoxPhotos, currentImageIndex } = this.state;

    return (
      <section className={className}>
        <Gallery
          ref={g => this.gallery = g}
          photos={photos}
          onClick={this.thumbnailSelected}
          columns={Math.min(photos.length, 3)}
        />
        <Lightbox
          images={lightBoxPhotos}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={currentImageIndex}
          isOpen={this.state.isLightboxOpen}
          // translator: divider between <currentImageIndex> and <imageCount> in lightbox, such as 1 of 10 
          imageCountSeparator={' ' + t`of` + ' '}
          // tranlator: alt info on next image button in lightbox
          rightArrowTitle={t`Next (Right arrow key)`}
          // tranlator: alt info on previous image button in lightbox
          leftArrowTitle={t`Previous (Left arrow key)`}
          // tranlator: alt info on close button in lightbox
          closeButtonTitle={t`Close (Esc)`}
          customControls={this.renderLightboxControls(className)}
          theme={{
          }}
        />

        <PhotoUploadButton
          onClick={onStartPhotoUploadFlow}
        />

        {photoFlowNotification && <PhotoNotification notificationType={photoFlowNotification} />}
      </section>
    )
  }
}

const StyledPhotoSection = styled(PhotoSection)`
  margin: .5rem -1rem;
  padding: 0;

  background: ${colors.coldBackgroundColor};

  .react-photo-gallery--gallery {
    &:hover {
      background: ${colors.linkBackgroundColorTransparent};
    }

    img {
      object-fit: contain;
    }
  }
  
  /* lazy workaround for Lightbox putting its nodes higher up in the dom */
  &.lightbox-actions {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;

    button {
      margin-top: 0.25rem;
      font-size: 0.8rem;
      font-weight: bold;
      color: ${colors.linkColor};
      background: none;
      border: none;
      cursor: pointer;

      &[disabled] {
        opacity: 0.8;
        color: ${colors.textColor};
        pointer-events: none;
      }
    }
  }
`;

export default StyledPhotoSection;
