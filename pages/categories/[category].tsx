import { useRouter } from 'next/router';

const Cat = () => {
  const router = useRouter();
  const { category } = router.query;

  return (
    <>
      <header />
      <h1>This Cat is called: {category}</h1>
    </>
  );
};

export default Cat;
