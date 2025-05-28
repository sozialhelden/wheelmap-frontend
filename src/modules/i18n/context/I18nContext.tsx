import { Flex, Spinner } from "@radix-ui/themes";
import { tx, t } from "@transifex/native";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useEnvironmentContext } from "~/modules/app/context/EnvironmentContext";
import { type LanguageTag, fallbackLanguageTag } from "~/modules/i18n/i18n";
import {
  getLabel,
  getLanguage,
  getRegion,
} from "~/modules/i18n/utils/language-tags";
import { getLocale } from "~/modules/i18n/utils/locales";
import { setTranslator } from "@sozialhelden/core";

export type I18nContext = {
  languageTag: LanguageTag;
  setLanguageTag: (languageTag: LanguageTag) => void;
  languageLabel: string;
  language?: string;
  region?: string;
};

export const I18nContext = createContext<I18nContext>({
  languageTag: fallbackLanguageTag,
  setLanguageTag: () => {},
  languageLabel: "",
  language: "",
  region: "",
});

export function useI18nContext(): I18nContext {
  return useContext(I18nContext);
}

export function I18nContextProvider({
  languageTag: givenLanguageTag,
  children,
}: {
  languageTag: LanguageTag;
  children: ReactNode;
}) {
  const env = useEnvironmentContext();

  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguageTag, setCurrentLanguageTag] =
    useState<LanguageTag>(givenLanguageTag);

  const language = getLanguage(currentLanguageTag);
  const region = getRegion(currentLanguageTag);
  const languageLabel = getLabel(currentLanguageTag);

  const setTransifexLocale = (languageTag: LanguageTag) => {
    setIsLoading(true);
    const locale = getLocale(languageTag);
    tx.setCurrentLocale(locale)
      .catch((error) => {
        console.error(`Error setting Transifex locale to "${locale}"`, error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const setLanguageTag = (languageTag: LanguageTag) => {
    setCurrentLanguageTag(languageTag);
    setTransifexLocale(languageTag);
  };

  useEffect(() => {
    if (!env.NEXT_PUBLIC_TRANSIFEX_NATIVE_TOKEN) {
      throw new Error(
        "Environment variable NEXT_PUBLIC_TRANSIFEX_NATIVE_TOKEN not set!",
      );
    }
    tx.init({
      token: env.NEXT_PUBLIC_TRANSIFEX_NATIVE_TOKEN,
      // filterStatus: "reviewed",
    });
    setTranslator(t);
    setTransifexLocale(currentLanguageTag);
  }, []);

  return (
    <I18nContext.Provider
      value={{
        languageTag: currentLanguageTag,
        setLanguageTag,
        languageLabel,
        language,
        region,
      }}
    >
      {!isLoading && children}
      {isLoading && (
        <Flex width="100vw" height="100vh" justify="center" align="center">
          <Spinner size="3" />
        </Flex>
      )}
    </I18nContext.Provider>
  );
}
