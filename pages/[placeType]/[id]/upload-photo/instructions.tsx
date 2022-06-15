import { useRouter } from 'next/router';

const UploadPhotoInstructions = () => {
  const router = useRouter();
  const { placeType, id } = router.query;

  console.log(router.query);
  return (
    <>
      <header />
      <h1>Upload Photo Instructions: {`id: ${id}, placeType: ${placeType}`}</h1>
    </>
  );
};

export default UploadPhotoInstructions;
