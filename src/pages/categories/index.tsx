import { useRouter } from 'next/router';
import Link from 'next/link';

const Category = () => {
  const router = useRouter();
  const { categories, category } = router.query;

  return <>
    <header />
    <h1>Cats: Mainpage</h1>
    <h2>Category: {category}</h2>
    <ul>
      <li>
        <Link href="/categories/category" as={`/categories/${category}/`}>
          The Cat
        </Link>
      </li>
    </ul>
  </>;
};

export default Category;

// import Link from 'next/link';

// function Categories() {
//   return (
//     <ul>
//       <li>
//         <Link href="/categories/toilet">
//           <a>Go to pages/categories/[category].tsx</a>
//         </Link>
//       </li>
//       <li>
//         <Link href="/categories/category?category=parking">
//           <a>Also goes to pages/categories/[category].tsx</a>
//         </Link>
//       </li>
//     </ul>
//   );
// }

// export default Categories;