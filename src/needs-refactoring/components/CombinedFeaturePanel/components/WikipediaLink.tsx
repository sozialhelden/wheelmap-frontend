import Link from "next/link";
import type { HTMLAttributes } from "react";
import type OSMFeature from "~/needs-refactoring/lib/model/osm/OSMFeature";
import { getWikipediaLemma } from "~/needs-refactoring/lib/model/osm/getWikipediaLemma";

type Props = HTMLAttributes<HTMLAnchorElement> & {
  feature: OSMFeature;
  prefix?: string;
  children: React.ReactNode;
};

/** Renders a link to Wikipedia, using the [prefix]:wikipedia property of the given feature. */

export default function WikipediaLink({ feature, prefix, ...rest }: Props) {
  const lemmaWithLanguagePrefix = getWikipediaLemma(feature, prefix);
  if (!lemmaWithLanguagePrefix) {
    return null;
  }

  const [language, lemma] = lemmaWithLanguagePrefix.split(":");
  if (language && lemma) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <Link
        href={`https://${language}.wikipedia.org/wiki/${lemma}`}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      />
    );
  }
  return <>{rest.children}</>;
}
