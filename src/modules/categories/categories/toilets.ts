import { t } from "@transifex/native";
import * as icons from "~/modules/categories/icons";

export const toilets = {
  toilets: {
    name: () => t("Toilets"),
    icon: icons.toilet,
    synonyms: [
      "amenity=toilets",
      "public_bathroom",
      "Public Bathroom",
      "Public Toilet",
      "800-8700-0198",
      "Eurokey-Anlage",
      "Öffentliche WC-Anlage",
    ],
    queryParams: {
      hasToiletInfo: "true",
    },
  },
} as const;
