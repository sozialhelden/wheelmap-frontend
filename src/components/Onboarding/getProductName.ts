import { t } from "ttag";
import { translatedStringFromObject } from "../../lib/i18n/translatedStringFromObject";

// select a white label product name
export const getProductName = (
  clientSideConfiguration: ClientSideConfiguration | undefined,
) =>
  translatedStringFromObject(
    clientSideConfiguration?.textContent?.product?.name,
  ) || "Wheelmap";
