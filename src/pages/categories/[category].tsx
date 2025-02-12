import { useRouter } from "next/router";
import { getLayout } from "../../components/App/MapLayout";

function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  return <div>TODO: Display a page for {category} here</div>;
}

export default CategoryPage;

CategoryPage.getLayout = getLayout;
