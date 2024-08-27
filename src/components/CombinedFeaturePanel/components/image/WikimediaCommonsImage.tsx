/**
 * Renders a React component that displays a Wikimedia Commons image with the given file name.
 */

import { omit } from 'lodash';

type Props = React.HTMLAttributes<HTMLImageElement> & {
  fileName: string;
};

export default function WikimediaCommonsImage(props: Props) {
  let url;
  const regexp = /^(?:(?:https?)\/\/commons.wikimedia.org\/wiki\/)?File:(.*)/i;
  const iri = props.fileName?.match(regexp)?.[0];
  if (iri) {
    url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
      iri,
    )}?width=200`;
  }
  if (!url) {
    return null;
  }

  return <img {...omit(props, 'fileName')} src={url} alt={props.fileName} />;
}
