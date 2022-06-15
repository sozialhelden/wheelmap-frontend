import Link from 'next/link';

const Events = () => {
  return (
    <>
      <header />
      <h1>All Events</h1>
      <ul>
        <li>
          <Link href="/events/1" as={`/events/1/`}>
            <a>#1</a>
          </Link>
        </li>
        <li>
          <Link href="/events/2" as={`/events/2/`}>
            <a>#2</a>
          </Link>
        </li>
        <li>
          <Link href="/events/3" as={`/events/3/`}>
            <a>#3</a>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Events;
