import { useRouter } from 'next/router';

const ReportOSMNonExisting = () => {
  const router = useRouter();
  const { placeType, id } = router.query;

  console.log(router.query);
  return (
    <>
      <header />
      <h1>Report OSM Position</h1>
      <h2>{`id: ${id}, placeType: ${placeType}`}</h2>
    </>
  );
};

export default ReportOSMNonExisting;