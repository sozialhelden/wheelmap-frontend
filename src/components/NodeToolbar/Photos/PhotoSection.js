// @flow

import * as React from 'react';
import styled from 'styled-components';
import Gallery from 'react-photo-gallery';
import type { PhotoModel } from './PhotoModel';
import Lightbox from 'react-images';
import { wheelmapFeaturePhotosCache } from '../../../lib/cache/WheelmapFeaturePhotosCache';
import convertWheelmapPhotosToLightboxPhotos from './convertWheelmapPhotosToLightboxPhotos';

import PhotoUploadButton from '../../PhotoUpload/PhotoUploadButton';
import PhotoUploadConfirmation from '../../PhotoUpload/PhotoUploadConfirmation';

type Props = {
  featureId: string,
};

type State = {
  isLightboxOpen: boolean,
  photos: PhotoModel[],
  currentImageIndex: number,
};

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
    if (props.featureId) {
      wheelmapFeaturePhotosCache
        .getPhotosForFeature(props.featureId)
        .then(photos => {
          this.setState({ photos: convertWheelmapPhotosToLightboxPhotos(photos) });
        });
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
          onClick={this.openLightbox}
          columns={Math.min(this.state.photos.length, 3)}
        />
        <Lightbox images={this.state.photos}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={this.state.currentImageIndex}
          isOpen={this.state.isLightboxOpen}
        />
        { /* FIXME: only show this component if no images have been uploaded */}
        {!hasPhotos && <PhotoUploadButton /> }
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
