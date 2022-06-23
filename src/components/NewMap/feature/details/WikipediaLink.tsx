import { HTMLAttributes } from "react";
import Feature from "../../../model/Feature";

type Props = HTMLAttributes<HTMLAnchorElement> & {
  feature: Feature;
  prefix?: string;
  children: React.ReactNode;
};

/** Renders a link to Wikipedia, using the [prefix]:wikipedia property of the given feature. */

export default function WikipediaLink({ feature, prefix, ...rest }: Props) {
  const lemmaWithLanguagePrefix =
    feature.properties[prefix ? `${prefix}:wikipedia` : "wikipedia"];
  if (!lemmaWithLanguagePrefix) {
    return null;
  }

  const [language, lemma] = lemmaWithLanguagePrefix.split(":");
  if (language && lemma) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a
        href={`https://${language}.wikipedia.org/wiki/${lemma}`}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      />
    );
  }
  return <>{rest.children}</>;
}
