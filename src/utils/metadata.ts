import { encode } from "js-base64";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "~/modules/i18n/utils/translations";
import { serverSideSetup } from "~/utils/server-side-setup";

export async function getDefaultMetadata(): Promise<Metadata> {
  const {
    whitelabelConfig: {
      clientSideConfiguration: {
        textContent = {},
        meta: { facebook, twitter },
        branding,
      },
    },
    languageTag,
  } = await serverSideSetup();

  const product = textContent?.product;

  const name = getTranslations(product?.name, languageTag) || "Wheelmap";
  const claim = getTranslations(product?.claim, languageTag) || "";
  const description = getTranslations(product?.description, languageTag) || "";

  const favicon =
    branding?.vectorIconSVG?.data &&
    `data:image/svg+xml;base64,${encode(branding.vectorIconSVG.data)}`;

  const image = facebook.imageURL
    ? {
        url: facebook.imageURL,
        width: facebook.imageWidth,
        height: facebook.imageHeight,
      }
    : twitter.imageURL
      ? {
          url: twitter.imageURL,
          width: twitter.imageWidth,
          height: twitter.imageHeight,
        }
      : undefined;

  return {
    metadataBase: new URL(`https://${headers().get("host")}`),
    title: {
      default: claim,
      template: `%s | ${name}`,
    },
    description,
    icons: {
      shortcut: favicon || "/favicon.ico",
      icon: favicon || "/favicon.ico",
    },
    other: {
      "apple-itunes-app":
        product?.name === "Wheelmap" ? "app-id=399239476" : "",
    },
    openGraph: {
      title: claim ? `${claim} | ${name}` : name,
      description,
      siteName: name,
      type: "website",
      url: "/",
      locale: languageTag,
      images: image && [image],
    },
    facebook: {
      appId: facebook.appId,
      admins: !facebook.appId ? facebook.admins : undefined,
    },
  };
}
