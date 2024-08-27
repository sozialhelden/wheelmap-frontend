import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useCurrentApp } from '../../lib/context/AppContext';
import { BERLIN } from '../../lib/fixtures/mocks/relations/berlin';
import Layout from '../../components/App/Layout';
import MockedPOIDetails from '../../lib/fixtures/mocks/features/MockedPOIDetails';

function RelationPage() {
  const router = useRouter();
  const { id } = router.query;
  const app = useCurrentApp();

  return (
    <>
      <MockedPOIDetails relation={BERLIN} description={`Relation: ${id}`} />
      ;
    </>
  );
}

RelationPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default RelationPage;
