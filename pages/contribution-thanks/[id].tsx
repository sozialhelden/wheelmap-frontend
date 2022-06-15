import { useRouter } from 'next/router';

const Contribs = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <header />
      <h1>Contrib: {id}</h1>
    </>
  );
};

export default Contribs;
