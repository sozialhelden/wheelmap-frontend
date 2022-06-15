import { useRouter } from 'next/router';

const Event = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <header />
      <h1>Event with ID: {id}</h1>
    </>
  );
};

export default Event;
