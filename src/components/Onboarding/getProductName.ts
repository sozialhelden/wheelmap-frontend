import { t } from "@transifex/native";
import { useTranslatedStringFromObject } from "../../lib/i18n/useTranslatedStringFromObject";

// select a white label product name
export const getProductName = (
  clientSideConfiguration: ClientSideConfiguration | undefined,
) =>
  useTranslatedStringFromObject(
    clientSideConfiguration?.textContent?.product?.name,
  ) || "Wheelmap";
