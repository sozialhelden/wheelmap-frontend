export type RootCategoryEntry = {
  name: string;
  isSubCategory?: boolean;
  applyCustomSearchParams?: (params: URLSearchParams) => void;
};
