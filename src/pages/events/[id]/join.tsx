import { useRouter } from 'next/router';

const JoinEvent = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <header />
      <h1>Click here to join the event with the ID: {id}</h1>
    </>
  );
};

export default JoinEvent;
