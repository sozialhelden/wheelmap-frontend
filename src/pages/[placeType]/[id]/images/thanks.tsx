import { useRouter } from 'next/router';

function UploadPhotoThanks() {
  const router = useRouter();
  const { placeType, id } = router.query;

  console.log(router.query);
  return (
    <>
      <header />
      <h1>Upload Photo Thank You page</h1>
      <h2>{`id: ${id}, placeType: ${placeType}`}</h2>
    </>
  );
}

export default UploadPhotoThanks;
