import { useRouter } from "next/router";
import useCategory from "../../lib/fetchers/useCategory";
import React, { useEffect } from "react";
import { anyFeature } from "../../lib/fixtures/mocks/features/anyfeature";
import MockedPOIDetails from "../../lib/fixtures/mocks/features/MockedPOIDetails";

const Cat = () => {
  const router = useRouter();
  const { category } = router.query;

  // attach the category to mock feature
  const myFeat = anyFeature;
  useEffect(() => {
    myFeat.properties["category"] = category as string;
  }, [category]);

  const myCat = useCategory(myFeat);

  const displayCat = myCat?.category?._id
    ? myCat.category._id
    : "not a valid category";

  return (
    <MockedPOIDetails
      feature={myFeat}
      description={`This cat is: ${displayCat}`}
    />
  );
};

export default Cat;
