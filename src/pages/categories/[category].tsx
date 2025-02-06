import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { getLayout } from "../../components/App/MapLayout";
import useCategory from "../../lib/fetchers/ac/refactor-this/useCategory";
import MockedPOIDetails from "../../lib/fixtures/mocks/features/MockedPOIDetails";
import { anyFeature } from "../../lib/fixtures/mocks/features/anyfeature";

function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  return <div>TODO: Display a page for {category} here</div>;
}

export default CategoryPage;

Cat.getLayout = getLayout;
