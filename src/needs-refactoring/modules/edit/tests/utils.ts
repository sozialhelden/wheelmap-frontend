import type { Locator, Page } from "@playwright/test";

export const selectLanguage = async (
  page: Page,
  dialog: Locator,
  language: string,
) => {
  await dialog.getByRole("combobox").click();
  const selectContent = page.getByTestId("select-content");
  await selectContent.getByText(language).click();
};

export const getButton = (dialog: Locator, name: string) => {
  return dialog.getByRole("button", { name: name });
};
