import { LIST_UNSTYLED } from '@blueprintjs/core/lib/esm/common/classes';

export default function ExternalFeatureLink(props: {
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <li className={LIST_UNSTYLED}>
      <a rel="noreferrer" target="_blank" href={props.href}>
        {props.children}
      </a>
    </li>
  );
}
