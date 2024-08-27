import router from 'next/router';
import StyledNotFound from '../components/NotFound/NotFound';

export default function NotFound() {
  return (
    <>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      Location of this file: src/pages/404.tsx
      {/* old way of 404ing: */}
      {/* <StyledNotFound
        className="404-not-found"
        onReturnHomeClick={() => router.push("/")}
        statusCode={404}
      /> */}
    </>
  );
}
