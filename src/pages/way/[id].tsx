import { useRouter } from 'next/router';

const Way = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <header />
      <h1>Way ID: {id}</h1>
    </>
  );
};

export default Way;
