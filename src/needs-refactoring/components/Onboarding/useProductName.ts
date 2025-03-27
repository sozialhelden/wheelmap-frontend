import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import type { ClientSideConfiguration } from "~/needs-refactoring/lib/model/ac/ClientSideConfiguration";

// select a white label product name
export const useProductName = (
  clientSideConfiguration: ClientSideConfiguration | undefined,
) =>
  useTranslations(clientSideConfiguration?.textContent?.product?.name) ||
  "Wheelmap";
