import { useRouter } from 'next/router';

const ReportOSMComment = () => {
  const router = useRouter();
  const { placeType, id } = router.query;

  console.log(router.query);
  return (
    <>
      <header />
      <h1>Report OSM Comment</h1>
      <h2>{`id: ${id}, placeType: ${placeType}`}</h2>
    </>
  );
};

export default ReportOSMComment;