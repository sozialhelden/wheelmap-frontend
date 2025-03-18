import type { ClientSideConfiguration } from "~/lib/model/ac/ClientSideConfiguration";
import { useTranslations } from "../../modules/i18n/hooks/useTranslations";

// select a white label product name
export const useProductName = (
  clientSideConfiguration: ClientSideConfiguration | undefined,
) =>
  useTranslations(clientSideConfiguration?.textContent?.product?.name) ||
  "Wheelmap";
