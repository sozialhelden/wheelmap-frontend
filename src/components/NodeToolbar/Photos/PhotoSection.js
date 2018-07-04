// @flow

import * as React from 'react';
import styled from 'styled-components';
import Gallery from 'react-photo-gallery';
import type { PhotoModel } from './PhotoModel';
import Lightbox from 'react-images';

import { wheelmapFeaturePhotosCache } from '../../../lib/cache/WheelmapFeaturePhotosCache';
import convertWheelmapPhotosToLightboxPhotos from './convertWheelmapPhotosToLightboxPhotos';
import type { WheelmapFeaturePhotos } from '../../../lib/Feature';

import PhotoUploadButton from '../../PhotoUpload/PhotoUploadButton';
import PhotoUploadConfirmation from '../../PhotoUpload/PhotoUploadConfirmation';

type Props = {
  featureId: string,
  onPhotoUploadFlowStarted: () => void; 
};

type State = {
  isLightboxOpen: boolean,
  photos: PhotoModel[],
  currentImageIndex: number,
};

// TODO replace with proper content
const addPhotoEntry = "data:image/png;base64,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";

class PhotoSection extends React.Component<Props, State> {
  state = {
    isLightboxOpen: false,
    photos: [],
    currentImageIndex: 0,
  };

  componentDidMount() {
    this.fetchPhotos(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.fetchPhotos(nextProps);
    if (nextProps.featureId !== this.props.featureId) {
      this.setState({ photos: [] });
    }
  }

  fetchPhotos(props: Props) {
    // TODO merge with ac photos
    if (props.featureId) {
      wheelmapFeaturePhotosCache
        .getPhotosForFeature(props.featureId)
        .then((wmPhotos: WheelmapFeaturePhotos) => {
          const photos = convertWheelmapPhotosToLightboxPhotos(wmPhotos);

          if (photos.length > 0) {
            photos.push({
              src: addPhotoEntry
            });
          }
          this.setState({ photos });
        });
    }
  }

  thumbnailSelected = (event: UIEvent, obj: { index: number }) => {
    // the last element is always the upload photo element
    if (obj.index === this.state.photos.length - 1) {
      this.props.onPhotoUploadFlowStarted();
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

  render() {
    const hasPhotos = this.state.photos.length > 0;

    return (
      <section>
        <Gallery
          photos={this.state.photos}
          onClick={this.thumbnailSelected}
          columns={Math.min(this.state.photos.length, 3)}
        />
        <Lightbox images={this.state.photos}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={this.state.currentImageIndex}
          isOpen={this.state.isLightboxOpen}
        />
        {!hasPhotos && 
          <PhotoUploadButton 
            onClick={this.props.onPhotoUploadFlowStarted} 
          /> 
        }
        <PhotoUploadConfirmation />
      </section>
    )
  }
}

const StyledThumbnailList = styled(PhotoSection)`
  .react-photo-gallery--gallery {
    img {
      object-fit: cover;
    }
  }
`;

export default StyledThumbnailList;
