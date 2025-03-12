import { t } from "@transifex/native";
/* eslint-disable @next/next/no-img-element */
import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLImageElement> & {
  url: string;
};

/**
 * Renders a React component that loads brand info from the Wikidata API (with SWR) and displays the
 * brand logo.
 */
export default function WikidataEntityImage({ url, ...props }: Props) {
  return <img {...props} src={url} aria-label={t("Place photo")} />;
}
