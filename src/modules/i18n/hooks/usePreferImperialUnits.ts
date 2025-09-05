import { useI18n } from "~/modules/i18n/hooks/useI18n";

export default function usePreferImperialUnits(): boolean {
  const { region } = useI18n();

  return region === "US" || region === "UK" || region === "CA";
}
