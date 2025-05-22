import { t } from "@transifex/native";
import * as icons from "~/modules/categories/icons";

export const moneyPost = {
  money_post: {
    name: () => t("Money"),
    icon: icons.bank,
    synonyms: [
      "finance",
      "accounting",
      "money_post",
      "Money Transferring Service",
      "Pawnshop",
      "Finance & Insurance Services",
      "700-7050-0109",
      "600-6900-0250",
      "700-7200-0271",
      "Bank",
    ],
  },

  post_box: {
    name: () => t("Post Box"),
    icon: icons.post,
    parents: ["money_post"],
    synonyms: ["amenity=post_box", "post_box", "Post box"],
  },

  currencyexchange: {
    name: () => t("Currency Exchange"),
    icon: icons.bank,
    parents: ["money_post"],
    synonyms: [
      "amenity=bureau_de_change",
      "Check Cashing Service",
      "Currency Exchange",
      "bureau_de_change",
      "Cheque Cashing & Currency Exchange",
      "700-7050-0110",
    ],
  },

  parcel_locker: {
    name: () => t("Parcel Locker"),
    icon: icons.circle, // TODO: use a better icon
    parents: ["money_post"],
    synonyms: ["amenity=parcel_locker"],
  },

  bank: {
    name: () => t("Bank"),
    icon: icons.bank,
    parents: ["money_post"],
    synonyms: [
      "amenity=bank",
      "bank",
      "bank",
      "Bank",
      "Credit Union",
      "Bank",
      "700-7000-0107",
    ],
  },

  post_office: {
    name: () => t("Post Office"),
    icon: icons.post,
    parents: ["money_post"],
    synonyms: [
      "amenity=post_office",
      "post_office",
      "post_office",
      "Post Office",
      "Post Office",
      "700-7450-0114",
      "700-7450-0294",
      "Post",
    ],
  },

  atm: {
    name: () => t("ATM"),
    icon: icons.bank,
    parents: ["money_post"],
    synonyms: [
      "amenity=atm",
      "atm",
      "atm",
      "ATM",
      "Cash Machine",
      "700-7010-0108",
      "Geldautomat",
    ],
  },
} as const;
