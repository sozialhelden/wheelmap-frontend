import { useI18n } from "~/modules/i18n/context/I18nContext";

export default function usePreferImperialUnits(): boolean {
  const { region } = useI18n();

  return region === "US" || region === "UK" || region === "CA";
}
