import { useI18n } from "~/modules/i18n/context/I18nContext";

/**
 * Determines if the zeroth level is skipped in the current context.
 * This is because in some countries, tagging floors above ground level
 * starts at 1 instead of 0. We currently skip 0 in Kazakhstan, Korea
 * and Mongolia.
 */
export function determineIfZerothLevelShouldBeSkipped() {
  const { language, region } = useI18n();

  if (["kk", "kaz", "ko", "kor", "mn", "mon"].includes(language)) {
    return true;
  }

  return ["KZ", "KR", "MN"].includes(region as string);
}
