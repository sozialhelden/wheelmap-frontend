import { useI18nContext } from "~/modules/i18n/context/I18nContext";

export default function usePreferImperialUnits(): boolean {
  const { language, region } = useI18nContext();

  if (language === "en") {
    return true;
  }

  return region === "US" || region === "UK" || region === "CA";
}
