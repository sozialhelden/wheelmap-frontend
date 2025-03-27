import { useI18nContext } from "~/modules/i18n/context/I18nContext";

export default function usePreferImperialUnits(): boolean {
  const { region } = useI18nContext();

  return region === "US" || region === "UK" || region === "CA";
}
