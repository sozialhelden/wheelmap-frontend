import { headers } from "next/headers";
import type { ReactNode } from "react";
import { App } from "~/modules/app/components/App";
import type { EnvironmentVariables } from "~/modules/app/context/EnvironmentContext";
import { getEnvironmentVariables } from "~/modules/app/utils/environment";
import type { LanguageTag } from "~/modules/i18n/i18n";

export const metadata = {};

export type Context = {
  environment: Record<string, string | undefined>;
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  /**
   * TODO: move this section into the App component when switching to the app router
   *  This can and should live in the app component. Because the App component is still
   *  used in _app.tsx by the pages router as well, and using the headers helper is not
   *  supported there this needs to be externalized for now.
   */
  // this is set by a custom middleware that handles language headers
  const languageTag = headers().get("x-preferred-language-tag") as LanguageTag;
  const hostname = headers().get("host")?.split(":").shift() as string;
  const environment = getEnvironmentVariables() as EnvironmentVariables;
  const userAgent = headers().get("user-agent") as string;

  return (
    <html lang={languageTag}>
      <body>
        <App context={{ environment, languageTag, hostname, userAgent }}>
          {children}
        </App>
      </body>
    </html>
  );
}
