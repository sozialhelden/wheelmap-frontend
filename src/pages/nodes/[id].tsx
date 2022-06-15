import { useRouter } from 'next/router';

const Nodes = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <header />
      <h1>Old or classic AC Nodes, ID: {id}</h1>
    </>
  );
};

export default Nodes;
