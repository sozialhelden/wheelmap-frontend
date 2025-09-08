import { useTranslations } from "~/modules/i18n/hooks/useTranslations";

import type { WhitelabelClientConfig } from "~/types/whitelabel";

// select a white label product name
export const useProductName = (
  clientSideConfiguration: WhitelabelClientConfig | undefined,
) =>
  useTranslations(clientSideConfiguration?.textContent?.product?.name) ||
  "Wheelmap";
