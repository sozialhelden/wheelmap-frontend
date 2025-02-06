import type {
  YesNoLimitedUnknown,
  YesNoUnknown,
} from "../../lib/model/ac/Feature";

export type PlaceFilter = {
  accessibilityFilter: YesNoLimitedUnknown[];
  toiletFilter: YesNoUnknown[];
};
