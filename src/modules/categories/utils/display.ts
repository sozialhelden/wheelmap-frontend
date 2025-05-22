import {
  type CategoryBaseProperties,
  type CategoryProperties,
  topLevelCategories,
} from "~/modules/categories/categories";

export function getTopLevelCategoryList() {
  return Object.entries(topLevelCategories)
    .map(([id, category]) => {
      return {
        ...category,
        id,
      };
    })
    .sort((a: CategoryBaseProperties, b: CategoryBaseProperties) => {
      return (a.priority ?? 9999) - (b.priority ?? 9999);
    }) as CategoryProperties[];
}
