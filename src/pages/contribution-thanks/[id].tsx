import { useRouter } from "next/router";
import { getLayout } from "../../components/App/MapLayout";

function Contribs() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <header />
      <h1>
        Contrib:
        {id}
      </h1>
    </>
  );
}

export default Contribs;

Contribs.getLayout = getLayout;
