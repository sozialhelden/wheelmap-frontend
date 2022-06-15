import { useRouter } from 'next/router';

const Node = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <header />
      <h1>Node ID: {id}</h1>
    </>
  );
};

export default Node;
