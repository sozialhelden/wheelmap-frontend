import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import type { WhitelabelClientConfig } from "~/types/whitelabel";

export function getProductTitle(
  clientSideConfiguration: WhitelabelClientConfig,
  specialisedTitle?: string,
  categoryName?: string,
): string {
  const { product } = clientSideConfiguration.textContent ?? {
    product: {
      name: "Wheelmap",
      claim: "Find wheelchair accessible places",
    },
  };
  const { name, claim } = product;

  const translatedProductName = useTranslations(name);
  const translatedClaim = useTranslations(claim);

  if (categoryName) {
    const translatedCategory = useTranslations(categoryName);
    return `${translatedCategory} - ${translatedProductName}`;
  }

  if (specialisedTitle) {
    return `${specialisedTitle} – ${translatedProductName}`;
  }

  return `${translatedProductName} – ${translatedClaim}`;
}
