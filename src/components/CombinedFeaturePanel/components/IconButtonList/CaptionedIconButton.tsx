import { Button, Text } from "@radix-ui/themes";
import styled from "styled-components";
import { AppStateLink } from "../../../App/AppStateLink";

type Props = {
  icon: React.ReactNode;
  caption: string;
  href: string;
  extraInfo?: string;
};

const ListItem = styled.li`
  svg {
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;

    g,
    rect,
    circle,
    path {
      fill: var(--accent-12);
    }
  }
`;

export function CaptionedIconButton({ icon, caption, href, extraInfo }: Props) {
  const content = (
    <>
      {icon}
      <Text>{caption}</Text>
      <Text>{extraInfo}</Text>
    </>
  );

  return (
    <ListItem>
      <Button asChild color="gray" size="2" variant="ghost">
        {href ? (
          <AppStateLink href={href} target="_blank" rel="noopener noreferrer">
            {content}
          </AppStateLink>
        ) : (
          content
        )}
      </Button>
    </ListItem>
  );
}
