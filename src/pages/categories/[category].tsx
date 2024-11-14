import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import useCategory from '../../lib/fetchers/ac/refactor-this/useCategory'
import { anyFeature } from '../../lib/fixtures/mocks/features/anyfeature'
import MockedPOIDetails from '../../lib/fixtures/mocks/features/MockedPOIDetails'
import { getLayout } from '../../components/App/MapLayout'

function Cat() {
  const router = useRouter()
  const { category } = router.query

  // attach the category to mock feature
  const myFeat = anyFeature
  useEffect(() => {
    myFeat.properties.category = category as string
  }, [category])

  const myCat = useCategory(myFeat)

  const displayCat = myCat?.category?._id
    ? myCat.category._id
    : 'not a valid category'

  return (
    <MockedPOIDetails
      feature={myFeat}
      description={`This cat is: ${displayCat}`}
    />
  )
}

export default Cat

Cat.getLayout = getLayout
