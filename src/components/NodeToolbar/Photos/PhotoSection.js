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

const addPhotoEntry =  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTE1cHgiIGhlaWdodD0iMTE1cHgiIHZpZXdCb3g9IjAgMCAxMTUgMTE1IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1MC4yICg1NTA0NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+Y3RhLWltYWdlL3VwbG9hZDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJjdGEtaW1hZ2UvdXBsb2FkIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBkPSJNNTksNTcgTDkwLDU3IEw5MCw1OSBMNTksNTkgTDU5LDkwIEw1Nyw5MCBMNTcsNTkgTDI2LDU5IEwyNiw1NyBMNTcsNTcgTDU3LDI2IEw1OSwyNiBMNTksNTcgWiIgaWQ9InBsdXMiIGZpbGw9IiNEMkQ3REQiPjwvcGF0aD4KICAgICAgICA8ZyBpZD0iY29ybmVyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MC4wMDAwMDAsIDQwLjAwMDAwMCkiPgogICAgICAgICAgICA8cG9seWdvbiBpZD0iUmVjdGFuZ2xlLTEyIiBmaWxsPSIjMkQ2QUUwIiBwb2ludHM9Ijc1IDAgNzUgNzUgMCA3NSI+PC9wb2x5Z29uPgogICAgICAgICAgICA8ZyBpZD0iaWNvbi9waG90by93aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzguMDAwMDAwLCAzOC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjkyMTU0MzI2LDEwLjYyOTAzMjMgTDExLjk3Mjg1Niw3LjYzNjI4MTk0IEMxMi4yNDYxNzM5LDcuMjg0ODczMTMgMTIuODI5OTI0Myw3IDEzLjI3MDQ4MTksNyBMMTkuNzI5NTE4MSw3IEMyMC4xNzI4NTkxLDcgMjAuNzUzNzQxMiw3LjI4NDc2NDA3IDIxLjAyNzE0NCw3LjYzNjI4MTk0IEwyMy4wNzg0NTY3LDEwLjYyOTAzMjMgTDI3LjM4ODUzNzIsMTAuNjI5MDMyMyBDMjguMjc4NTIzNSwxMC42MjkwMzIzIDI5LDExLjM0ODYyMzggMjksMTIuMjM5ODM5OCBMMjksMjMuOTM3NTc5NSBDMjksMjQuODI3MjA0IDI4LjI3ODc2LDI1LjU0ODM4NzEgMjcuMzg4NTM3MiwyNS41NDgzODcxIEw1LjYxMTQ2Mjc3LDI1LjU0ODM4NzEgQzQuNzIxNDc2NDYsMjUuNTQ4Mzg3MSA0LDI0LjgyODc5NTYgNCwyMy45Mzc1Nzk1IEw0LDEyLjIzOTgzOTggQzQsMTEuMzUwMjE1NCA0LjcyMTI0MDA0LDEwLjYyOTAzMjMgNS42MTE0NjI3NywxMC42MjkwMzIzIEw5LjkyMTU0MzI2LDEwLjYyOTAzMjMgWiBNMTYuNSwyMy41MzIyNTgxIEMxOS42MTc3MzY1LDIzLjUzMjI1ODEgMjIuMTQ1MTYxMywyMS4wMDQ4MzMzIDIyLjE0NTE2MTMsMTcuODg3MDk2OCBDMjIuMTQ1MTYxMywxNC43NjkzNjAzIDE5LjYxNzczNjUsMTIuMjQxOTM1NSAxNi41LDEyLjI0MTkzNTUgQzEzLjM4MjI2MzUsMTIuMjQxOTM1NSAxMC44NTQ4Mzg3LDE0Ljc2OTM2MDMgMTAuODU0ODM4NywxNy44ODcwOTY4IEMxMC44NTQ4Mzg3LDIxLjAwNDgzMzMgMTMuMzgyMjYzNSwyMy41MzIyNTgxIDE2LjUsMjMuNTMyMjU4MSBaIE0xNi41LDIyLjMyMjU4MDYgQzE0LjA1MDM0OTksMjIuMzIyNTgwNiAxMi4wNjQ1MTYxLDIwLjMzNjc0NjkgMTIuMDY0NTE2MSwxNy44ODcwOTY4IEMxMi4wNjQ1MTYxLDE1LjQzNzQ0NjcgMTQuMDUwMzQ5OSwxMy40NTE2MTI5IDE2LjUsMTMuNDUxNjEyOSBDMTguOTQ5NjUwMSwxMy40NTE2MTI5IDIwLjkzNTQ4MzksMTUuNDM3NDQ2NyAyMC45MzU0ODM5LDE3Ljg4NzA5NjggQzIwLjkzNTQ4MzksMjAuMzM2NzQ2OSAxOC45NDk2NTAxLDIyLjMyMjU4MDYgMTYuNSwyMi4zMjI1ODA2IFogTTUuNjEyOTAzMjMsOC42MTI5MDMyMyBDNS42MTI5MDMyMyw4LjE2NzUxMjMgNS45NzA0NDYxMSw3LjgwNjQ1MTYxIDYuNDE4NTg5MjYsNy44MDY0NTE2MSBMOC4wMzMwMjM2NSw3LjgwNjQ1MTYxIEM4LjQ3Nzk5MTc2LDcuODA2NDUxNjEgOC44Mzg3MDk2OCw4LjE2NDQwNzExIDguODM4NzA5NjgsOC42MTI5MDMyMyBMOC44Mzg3MDk2OCw5LjQxOTM1NDg0IEw1LjYxMjkwMzIzLDkuNDE5MzU0ODQgTDUuNjEyOTAzMjMsOC42MTI5MDMyMyBaIE0yMy4zNTQ4Mzg3LDEzLjQ1MTYxMjkgQzIzLjgwMDIyOTYsMTMuNDUxNjEyOSAyNC4xNjEyOTAzLDEzLjA5MDU1MjIgMjQuMTYxMjkwMywxMi42NDUxNjEzIEMyNC4xNjEyOTAzLDEyLjE5OTc3MDQgMjMuODAwMjI5NiwxMS44Mzg3MDk3IDIzLjM1NDgzODcsMTEuODM4NzA5NyBDMjIuOTA5NDQ3OCwxMS44Mzg3MDk3IDIyLjU0ODM4NzEsMTIuMTk5NzcwNCAyMi41NDgzODcxLDEyLjY0NTE2MTMgQzIyLjU0ODM4NzEsMTMuMDkwNTUyMiAyMi45MDk0NDc4LDEzLjQ1MTYxMjkgMjMuMzU0ODM4NywxMy40NTE2MTI5IFoiIGlkPSJSZWN0YW5nbGUtOTg0Ij48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";

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

    if (mergedPhotos.length > 0) {
      // add upload more placeholder
      mergedPhotos.push({
        src: addPhotoEntry,
        srcSet: [addPhotoEntry],
        sizes: [''],
        width: 1,
        height: 1,
        imageId: 'invalid-id',
        source: 'generated',
      });
    }

    this.setState({ photos: mergedPhotos }, () => {
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
          imageCountSeparator={' ' + t`of` + ' '}
          rightArrowTitle={t`Next (Right arrow key)`}
          leftArrowTitle={t`Previous (Left arrow key)`}
          closeButtonTitle={t`Close (Esc)`}
          customControls={this.renderLightboxControls(className)}
          theme={{
          }}
        />
        {!hasPhotos && 
          <PhotoUploadButton 
            onClick={onStartPhotoUploadFlow} 
          /> 
        }
        {photoFlowNotification && <PhotoNotification notificationType={photoFlowNotification} />}
      </section>
    )
  }
}

const StyledPhotoSection = styled(PhotoSection)`
  .react-photo-gallery--gallery {
    background: ${colors.evenMoreTransparentLinkColor};

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
