import { headers } from "next/headers";
import type { EnvironmentVariables } from "~/hooks/useEnvironment";
import { getLanguageTagFromAcceptLanguageHeaders } from "~/modules/i18n/utils/headers";
import { initTransifex, setTransifexLocale } from "~/modules/i18n/utils/init";
import { getPublicEnvironmentVariables } from "~/utils/environment";
import { getWhitelabelConfig } from "~/utils/whitelabel";

/**
 * Sets up the application on the server-side.
 */
export async function serverSideSetup() {
  // This is supposed to be used in a server component, so we can access the backends
  // runtime environment variables and provide them to the rest of the application,
  // effectively allowing runtime configuration instead of build-time configuration.
  const environment = getPublicEnvironmentVariables() as EnvironmentVariables;

  const hostname = environment.CD_FQDN || "wheelmap.org";
  const userAgent = headers().get("user-agent") as string;

  const whitelabelConfig = await getWhitelabelConfig(hostname);

  // We need to initialize Transifex on the server side and the client side.
  // The client side initialization happens in the useI18n hook
  initTransifex(environment.NEXT_PUBLIC_TRANSIFEX_NATIVE_TOKEN);
  const languageTag = getLanguageTagFromAcceptLanguageHeaders();
  await setTransifexLocale(languageTag);

  return { environment, languageTag, hostname, userAgent, whitelabelConfig };
}
