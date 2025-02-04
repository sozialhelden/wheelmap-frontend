import {
  type Category,
  type CategoryProperties,
  categories,
} from "~/config/categories";

export function useCategories() {
  return {
    categories: Object.entries(categories)
      .map(([id, category]) => {
        return {
          ...category,
          id,
        };
      })
      .sort((a: CategoryProperties, b: CategoryProperties) => {
        return (a.priority ?? 9999) - (b.priority ?? 9999);
      }) as (CategoryProperties & { id: Category })[],
  };
}
