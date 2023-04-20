// onStartReportPhotoFlow = (photo: PhotoModel) => {
//   this.setState({ isSearchBarVisible: false, photoMarkedForReport: photo });
// };

// onFinishReportPhotoFlow = (photo: PhotoModel, reason: string) => {
//   if (photo.appSource === 'accessibility-cloud') {
//     accessibilityCloudImageCache.reportPhoto(String(photo._id), reason, this.props.app.tokenString);
//     this.onExitReportPhotoFlow('reported');
//   }
// };

// onExitReportPhotoFlow = (notification?: string) => {
//   this.setState({
//     isSearchBarVisible: !isOnSmallViewport(),
//     photoMarkedForReport: null,
//     photoFlowNotification: notification,
//   });
// };

import { useRouter } from "next/router";

const PlaceImageReportPage = () => {
  const router = useRouter();
  const { placeType, imageId } = router.query;

  console.log(router.query);

  // <ReportPhotoToolbar
  //   hidden={!this.props.photoMarkedForReport}
  //   photo={this.props.photoMarkedForReport}
  //   onClose={this.props.onAbortReportPhotoFlow}
  //   onCompleted={this.props.onFinishReportPhotoFlow}
  // />
  return (
    <>
      <header />
      <h1>
        Upload Photo Instructions:{" "}
        {`imageId: ${imageId}, placeType: ${placeType}`}
      </h1>
    </>
  );
};

export default PlaceImageReportPage;
