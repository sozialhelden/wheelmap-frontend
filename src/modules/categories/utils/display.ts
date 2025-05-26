import {
  getTopLevelCategories,
  type CategoryBaseProperties,
  type CategoryProperties,
} from "@sozialhelden/core";

export function getTopLevelCategoryList() {
  return Object.entries(getTopLevelCategories())
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
