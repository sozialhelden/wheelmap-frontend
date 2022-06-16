import { useRouter } from 'next/router';

const UploadPhotoInstructions = () => {
  const router = useRouter();
  const { placeType, id } = router.query;

  //   <PhotoUploadInstructionsToolbar
  // ref={photoUploadInstructionsToolbar =>
  //   (this.photoUploadInstructionsToolbar = photoUploadInstructionsToolbar)
  // }
  // hidden={!this.props.isPhotoUploadInstructionsToolbarVisible}
  // waitingForPhotoUpload={this.props.waitingForPhotoUpload}
  // onClose={this.props.onAbortPhotoUploadFlow}
  // onCompleted={this.props.onContinuePhotoUploadFlow}
  // />
  console.log(router.query);
  return (
    <>
      <header />
      <h1>Upload Photo Instructions: {`id: ${id}, placeType: ${placeType}`}</h1>
    </>
  );
};

export default UploadPhotoInstructions;
