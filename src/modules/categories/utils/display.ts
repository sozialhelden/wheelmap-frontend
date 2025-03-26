import {
  type Category,
  type CategoryProperties,
  categories,
} from "~/modules/categories/categories";

export type CategoryListItem = CategoryProperties & { id: Category };

export function getCategoryList() {
  return Object.entries(categories)
    .map(([id, category]) => {
      return {
        ...category,
        id,
      };
    })
    .sort((a: CategoryProperties, b: CategoryProperties) => {
      return (a.priority ?? 9999) - (b.priority ?? 9999);
    }) as CategoryListItem[];
}
