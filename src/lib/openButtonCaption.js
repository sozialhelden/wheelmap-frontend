import { t } from 'c-3po';

// The naming of `sourceNameString` is to have a consistent translation on transifex for all 'open on ...' links.
export default function openButtonCaption(sourceNameString) {
  // translator: Button caption shown in the place toolbar.
  return t`Open on ${ sourceNameString }`;
}
