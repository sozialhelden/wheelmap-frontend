import Link from 'next/link'
import styled from 'styled-components'
import colors from '../../lib/util/colors'

const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 2.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${colors.darkLinkColor};
  font-weight: 500;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;

    g,
    rect,
    circle,
    path {
      fill: ${colors.tonedDownSelectedColor};
    }
  }

  &:not(:hover) {
    color: ${colors.textColorTonedDown};
  }
`

export default function PanelButton(props: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const {
    icon, children, onClick, href,
  } = props
  const button = (
    <Button onClick={onClick} className="panel-button">
      {icon}
      {children}
    </Button>
  )
  return href ? <Link href={href}>{button}</Link> : button
}
