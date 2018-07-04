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
import PhotoNotifcation from '../../NodeToolbar/Photos/PhotoNotification';
import CtaPhotoUpload from './CtaPhotoUpload';

type Props = {
  featureId: string,
  onStartPhotoUploadFlow: () => void; 
};

type State = {
  isLightboxOpen: boolean,
  photos: PhotoModel[],
  currentImageIndex: number,
};

const StyledCtaPhotoUpload = styled(CtaPhotoUpload)`
  path { 
    fill: ${props => props.color};
  }
`;

// TODO replace with proper content
const addPhotoEntry =  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTE1cHgiIGhlaWdodD0iMTE1cHgiIHZpZXdCb3g9IjAgMCAxMTUgMTE1IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1MC4yICg1NTA0NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+Y3RhLWltYWdlL3VwbG9hZDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJjdGEtaW1hZ2UvdXBsb2FkIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBkPSJNNTksNTcgTDkwLDU3IEw5MCw1OSBMNTksNTkgTDU5LDkwIEw1Nyw5MCBMNTcsNTkgTDI2LDU5IEwyNiw1NyBMNTcsNTcgTDU3LDI2IEw1OSwyNiBMNTksNTcgWiIgaWQ9InBsdXMiIGZpbGw9IiNEMkQ3REQiPjwvcGF0aD4KICAgICAgICA8ZyBpZD0iY29ybmVyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MC4wMDAwMDAsIDQwLjAwMDAwMCkiPgogICAgICAgICAgICA8cG9seWdvbiBpZD0iUmVjdGFuZ2xlLTEyIiBmaWxsPSIjMkQ2QUUwIiBwb2ludHM9Ijc1IDAgNzUgNzUgMCA3NSI+PC9wb2x5Z29uPgogICAgICAgICAgICA8ZyBpZD0iaWNvbi9waG90by93aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzguMDAwMDAwLCAzOC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjkyMTU0MzI2LDEwLjYyOTAzMjMgTDExLjk3Mjg1Niw3LjYzNjI4MTk0IEMxMi4yNDYxNzM5LDcuMjg0ODczMTMgMTIuODI5OTI0Myw3IDEzLjI3MDQ4MTksNyBMMTkuNzI5NTE4MSw3IEMyMC4xNzI4NTkxLDcgMjAuNzUzNzQxMiw3LjI4NDc2NDA3IDIxLjAyNzE0NCw3LjYzNjI4MTk0IEwyMy4wNzg0NTY3LDEwLjYyOTAzMjMgTDI3LjM4ODUzNzIsMTAuNjI5MDMyMyBDMjguMjc4NTIzNSwxMC42MjkwMzIzIDI5LDExLjM0ODYyMzggMjksMTIuMjM5ODM5OCBMMjksMjMuOTM3NTc5NSBDMjksMjQuODI3MjA0IDI4LjI3ODc2LDI1LjU0ODM4NzEgMjcuMzg4NTM3MiwyNS41NDgzODcxIEw1LjYxMTQ2Mjc3LDI1LjU0ODM4NzEgQzQuNzIxNDc2NDYsMjUuNTQ4Mzg3MSA0LDI0LjgyODc5NTYgNCwyMy45Mzc1Nzk1IEw0LDEyLjIzOTgzOTggQzQsMTEuMzUwMjE1NCA0LjcyMTI0MDA0LDEwLjYyOTAzMjMgNS42MTE0NjI3NywxMC42MjkwMzIzIEw5LjkyMTU0MzI2LDEwLjYyOTAzMjMgWiBNMTYuNSwyMy41MzIyNTgxIEMxOS42MTc3MzY1LDIzLjUzMjI1ODEgMjIuMTQ1MTYxMywyMS4wMDQ4MzMzIDIyLjE0NTE2MTMsMTcuODg3MDk2OCBDMjIuMTQ1MTYxMywxNC43NjkzNjAzIDE5LjYxNzczNjUsMTIuMjQxOTM1NSAxNi41LDEyLjI0MTkzNTUgQzEzLjM4MjI2MzUsMTIuMjQxOTM1NSAxMC44NTQ4Mzg3LDE0Ljc2OTM2MDMgMTAuODU0ODM4NywxNy44ODcwOTY4IEMxMC44NTQ4Mzg3LDIxLjAwNDgzMzMgMTMuMzgyMjYzNSwyMy41MzIyNTgxIDE2LjUsMjMuNTMyMjU4MSBaIE0xNi41LDIyLjMyMjU4MDYgQzE0LjA1MDM0OTksMjIuMzIyNTgwNiAxMi4wNjQ1MTYxLDIwLjMzNjc0NjkgMTIuMDY0NTE2MSwxNy44ODcwOTY4IEMxMi4wNjQ1MTYxLDE1LjQzNzQ0NjcgMTQuMDUwMzQ5OSwxMy40NTE2MTI5IDE2LjUsMTMuNDUxNjEyOSBDMTguOTQ5NjUwMSwxMy40NTE2MTI5IDIwLjkzNTQ4MzksMTUuNDM3NDQ2NyAyMC45MzU0ODM5LDE3Ljg4NzA5NjggQzIwLjkzNTQ4MzksMjAuMzM2NzQ2OSAxOC45NDk2NTAxLDIyLjMyMjU4MDYgMTYuNSwyMi4zMjI1ODA2IFogTTUuNjEyOTAzMjMsOC42MTI5MDMyMyBDNS42MTI5MDMyMyw4LjE2NzUxMjMgNS45NzA0NDYxMSw3LjgwNjQ1MTYxIDYuNDE4NTg5MjYsNy44MDY0NTE2MSBMOC4wMzMwMjM2NSw3LjgwNjQ1MTYxIEM4LjQ3Nzk5MTc2LDcuODA2NDUxNjEgOC44Mzg3MDk2OCw4LjE2NDQwNzExIDguODM4NzA5NjgsOC42MTI5MDMyMyBMOC44Mzg3MDk2OCw5LjQxOTM1NDg0IEw1LjYxMjkwMzIzLDkuNDE5MzU0ODQgTDUuNjEyOTAzMjMsOC42MTI5MDMyMyBaIE0yMy4zNTQ4Mzg3LDEzLjQ1MTYxMjkgQzIzLjgwMDIyOTYsMTMuNDUxNjEyOSAyNC4xNjEyOTAzLDEzLjA5MDU1MjIgMjQuMTYxMjkwMywxMi42NDUxNjEzIEMyNC4xNjEyOTAzLDEyLjE5OTc3MDQgMjMuODAwMjI5NiwxMS44Mzg3MDk3IDIzLjM1NDgzODcsMTEuODM4NzA5NyBDMjIuOTA5NDQ3OCwxMS44Mzg3MDk3IDIyLjU0ODM4NzEsMTIuMTk5NzcwNCAyMi41NDgzODcxLDEyLjY0NTE2MTMgQzIyLjU0ODM4NzEsMTMuMDkwNTUyMiAyMi45MDk0NDc4LDEzLjQ1MTYxMjkgMjMuMzU0ODM4NywxMy40NTE2MTI5IFoiIGlkPSJSZWN0YW5nbGUtOTg0Ij48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";


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
              src: addPhotoEntry,
              width: 100,
              height: 100,
            });
          }
          this.setState({ photos });
        });
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
            onClick={this.props.onStartPhotoUploadFlow} 
          /> 
        }
        <PhotoNotifcation notificationType='waitingForReview' />
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
