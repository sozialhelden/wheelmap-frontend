import { useRouter } from 'next/router';

function WheelchairToiletA11y() {
  const router = useRouter();
  const { placeType, id } = router.query;

  console.log(router.query);
  return (
    <>
      <header />
      <h1>Wheelchair Toilet Accessibility of Place Page</h1>
      <h2>{`PlaceId: ${id}, placeType: ${placeType}`}</h2>
    </>
  );
}

export default WheelchairToiletA11y;
