import { useRouter } from 'next/router';

function ReportSendToAC() {
  const router = useRouter();
  const { placeType, id } = router.query;

  console.log(router.query);
  return (
    <>
      <header />
      <h1>Report Send TO AC Page</h1>
      <h2>{`id: ${id}, placeType: ${placeType}`}</h2>
    </>
  );
}

export default ReportSendToAC;
