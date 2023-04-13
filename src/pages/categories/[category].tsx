import { useRouter } from "next/router";
import { fixtureDivStyle } from "../../lib/fixtures/mocks/styles";
import useCategory from "../../lib/fetchers/useCategory";
import { AnyFeature } from "../../lib/model/shared/AnyFeature";
import React, { use, useEffect, useState } from "react";
import { anyFeat } from "../../lib/fixtures/mocks/features/anyfeat";
import { SWRResponse } from "swr";
import { ACCategory } from "../../lib/model/ac/categories/ACCategory";

const Cat = () => {
  const router = useRouter();
  const { category } = router.query;

  // attach the category to mock feature
  const myFeat = anyFeat;
  useEffect(() => {
    myFeat.properties["category"] = category as string;
  }, [category]);

  const myCat = useCategory(myFeat);
  // console.log("cat", myCat.category?._id);

  const displayCat = myCat?.category?._id
    ? myCat.category._id
    : "not a valid category";

  return (
    <>
      <header />
      <div style={fixtureDivStyle}>
        <p>This Cat is: {displayCat}</p>
        <section>
          <pre>{JSON.stringify(anyFeat, null, 2)}</pre>
        </section>
      </div>
    </>
  );
};

export default Cat;
