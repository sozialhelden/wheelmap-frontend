// @flow

import * as React from 'react';
import styled from 'styled-components';
import Gallery from 'react-photo-gallery';
import type { PhotoModel } from './PhotoModel';
import Lightbox from 'react-images';
import { wheelmapFeaturePhotosCache } from '../../../lib/cache/WheelmapFeaturePhotosCache';
import convertWheelmapPhotosToLightboxPhotos from './convertWheelmapPhotosToLightboxPhotos';

type Props = {
  featureId: string,
};

type State = {
  isLightboxOpen: boolean,
  photos: PhotoModel[],
  currentImageIndex: number,
};


class ThumbnailList extends React.Component<Props, State> {
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
    return (
      <div>
        <Gallery
          photos={this.state.photos}
          onClick={this.openLightbox}
        />
        <Lightbox images={this.state.photos}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={this.state.currentImageIndex}
          isOpen={this.state.isLightboxOpen}
        />
      </div>
    )
  }
}

const StyledThumbnailList = styled(ThumbnailList)`
  .react-photo-gallery--gallery {
    img {
      object-fit: cover;
    }
  }
`;

export default StyledThumbnailList;
