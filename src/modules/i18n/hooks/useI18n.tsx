import { Flex, Spinner } from "@radix-ui/themes";
import {
  type LanguageTag,
  fallbackLanguageTag,
  getLabel,
  getLanguage,
  getRegion,
} from "@sozialhelden/core";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useEnvironment } from "~/hooks/useEnvironment";
import { initTransifex, setTransifexLocale } from "~/modules/i18n/utils/init";

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

export function useI18n(): I18nContext {
  return useContext(I18nContext);
}

export function I18nContextProvider({
  languageTag: givenLanguageTag,
  children,
}: {
  languageTag: LanguageTag;
  children: ReactNode;
}) {
  const env = useEnvironment();

  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguageTag, setCurrentLanguageTag] =
    useState<LanguageTag>(givenLanguageTag);

  const language = getLanguage(currentLanguageTag);
  const region = getRegion(currentLanguageTag);
  const languageLabel = getLabel(currentLanguageTag);

  const setLanguageTag = (languageTag: LanguageTag) => {
    setCurrentLanguageTag(languageTag);

    setIsLoading(true);
    setTransifexLocale(languageTag).finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (!env.NEXT_PUBLIC_TRANSIFEX_NATIVE_TOKEN) {
      throw new Error(
        "Environment variable NEXT_PUBLIC_TRANSIFEX_NATIVE_TOKEN not set!",
      );
    }
    initTransifex(env.NEXT_PUBLIC_TRANSIFEX_NATIVE_TOKEN);
    setLanguageTag(currentLanguageTag);
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
