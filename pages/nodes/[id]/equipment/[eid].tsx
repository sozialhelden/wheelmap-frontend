import { useRouter } from 'next/router';

const Equipment = () => {
  const router = useRouter();
  const { id, eid } = router.query;

  return (
    <>
      <header />
      <h1>Equipment at old or classic AC Nodes, </h1>
      <h2>PlaceId: {id}</h2>
      <h2>EID: {eid}</h2>
    </>
  );
};

export default Equipment;
