import { useRouter } from "next/router";
import React from "react";
import { ReactElement, useCallback } from "react";
import { t } from "ttag";
import Layout from "../../../../components/App/Layout";
import PhotoUploadInstructionsToolbar from "../../../../components/NodeToolbar/Photos/PhotoUpload/PhotoUploadInstructionsToolbar";
import { useCurrentAppToken } from "../../../../lib/context/AppContext";
import postImageUpload from "../../../../lib/fetchers/postImageUpload";
import { toast } from "react-toastify";

export default function Page() {
  const router = useRouter();
  const { placeType, id } = router.query;
  if (typeof id !== "string") {
    throw new Error("Feature ID must be a single string.");
  }

  // <PhotoUploadInstructionsToolbar
  // ref={photoUploadInstructionsToolbar =>
  //   (this.photoUploadInstructionsToolbar = photoUploadInstructionsToolbar)
  // }
  // hidden={!this.props.isPhotoUploadInstructionsToolbarVisible}
  // waitingForPhotoUpload={this.props.waitingForPhotoUpload}
  // onClose={this.props.onAbortPhotoUploadFlow}
  // onCompleted={this.props.onContinuePhotoUploadFlow}
  // />

  const closeToolbar = useCallback(() => {
    router.push(`/${placeType}/${id}`);
  }, [router, placeType, id]);

  const [waitingForPhotoUpload, setWaitingForPhotoUpload] = React.useState(
    false
  );

  const appToken = useCurrentAppToken();

  const uploadFiles = useCallback(
    async (photos: FileList) => {
      setWaitingForPhotoUpload(true);
      try {
        const result = await postImageUpload(id, "place", photos, appToken);
        if (result.result._id) {
          toast.success(
            t`Thank you for contributing. Your image will be visible after we have checked it.`
          );
        }
      } catch (error) {
        toast.error(
          t`Upload failed: server error or file-format not supported`
        );
      }

      router.push(`/${placeType}/${id}`);
    },
    [router, placeType, id, appToken]
  );

  return (
    <PhotoUploadInstructionsToolbar
      onClose={closeToolbar}
      onCompleted={uploadFiles}
      waitingForPhotoUpload={waitingForPhotoUpload}
    />
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout blur={true}>{page}</Layout>;
};
