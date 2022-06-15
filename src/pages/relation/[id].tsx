import { useRouter } from 'next/router';

const Relation = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <header />
      <h1>Relation ID: {id}</h1>
    </>
  );
};

export default Relation;
