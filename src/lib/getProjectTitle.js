import { t } from 'ttag';

export default function getProjectTitle(title: ?string) {
  const projectName = t`Wheelmap.org`;
  const fallback = t`Find wheelchair accessible places`;

  if (!title) {
    return `${projectName} – ${fallback}`;
  }

  return `${title} – ${projectName}`;
}
