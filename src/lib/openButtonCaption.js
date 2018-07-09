import { t } from 'c-3po';

// The naming of `sourceNameString` is to have a consistent translation on transifex for all 'open on ...' links.
export default function openButtonCaption(sourceNameString) {
  return t`Open on ${ sourceNameString }`;
}
