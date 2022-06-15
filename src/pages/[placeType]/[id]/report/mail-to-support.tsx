import { useRouter } from 'next/router';

const ReportSupportMail = () => {
  const router = useRouter();
  const { placeType, id } = router.query;

  console.log(router.query);
  return (
    <>
      <header />
      <h1>Report Support Mail Page</h1>
      <h2>{`id: ${id}, placeType: ${placeType}`}</h2>
    </>
  );
};

export default ReportSupportMail;
