// onStartPhotoUploadFlow = () => {
//   this.setState({
//     isSearchBarVisible: false,
//     waitingForPhotoUpload: false,
//     isPhotoUploadInstructionsToolbarVisible: true,
//     photosMarkedForUpload: null,
//     photoFlowErrorMessage: null,
//   });
// };

// onExitPhotoUploadFlow = (
//   notification: string = null,
//   photoFlowErrorMessage: string | null = null
// ) => {
//   this.setState({
//     photoFlowErrorMessage,
//     isSearchBarVisible: !isOnSmallViewport(),
//     waitingForPhotoUpload: false,
//     isPhotoUploadInstructionsToolbarVisible: false,
//     photosMarkedForUpload: null,
//     photoFlowNotification: notification,
//   });
// };

// onContinuePhotoUploadFlow = (photos: FileList) => {
//   if (photos.length === 0) {
//     this.onExitPhotoUploadFlow();
//     return;
//   }

//   this.onFinishPhotoUploadFlow(photos);
// };

// onFinishPhotoUploadFlow = (photos: FileList) => {
//   console.log('onFinishPhotoUploadFlow');
//   const { featureId } = this.props;

//   if (!featureId) {
//     console.error('No feature found, aborting upload!');
//     this.onExitPhotoUploadFlow();
//     return;
//   }

//   this.setState({ waitingForPhotoUpload: true, photoFlowNotification: 'uploadProgress' });

//   accessibilityCloudImageCache
//     .uploadPhotoForFeature(String(featureId), photos, this.props.app.tokenString)
//     .then(() => {
//       console.log('Succeeded upload');
//       this.onExitPhotoUploadFlow('waitingForReview');
//     })
//     .catch(reason => {
//       console.error('Failed upload', reason);
//       this.onExitPhotoUploadFlow('uploadFailed', reason && reason.message);
//     });
// };

// #lightboxBackdrop {
//   backdrop-filter: blur(10px);
//   background-color: rgba(0, 0, 0, 0.9);
// }

function UploadPhoto() {
  return (
    <div>
      <h1>Upload Photo Index Page</h1>
    </div>
  )
}

export default UploadPhoto
