import styled, { css } from 'styled-components'
import { omit } from 'lodash'
import ISVGOResult from '../../lib/model/ac/ISVGOResult'

type ContainerProps = {
  maxWidth?: string,
  maxHeight?: string,
  hasShadow?: boolean,
};

export const shadowCSS = css`
  filter: drop-shadow(0 2px 0px rgba(0, 0, 0, 0.06)) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.06));
`

const Container = styled.span <
  ContainerProps >`
display: inline-block;
vertical-align: middle;
svg {
  ${(p) => (p.hasShadow === false ? null : shadowCSS)}
  max-height: ${(p) => p.maxHeight || '1.5em'};
  max-width: ${(p) => p.maxWidth || '1.5em'};
}
`

type Props = ContainerProps &
  React.HTMLAttributes<HTMLSpanElement> & {
    svg: ISVGOResult,
  };

export default function VectorImage(props: Props) {
  const svgSource = props.svg?.data
  if (!svgSource) {
    return null
  }
  return (
    <Container
      dangerouslySetInnerHTML={{ __html: svgSource || '' }}
      {...omit(props, 'svg', 'hasShadow')}
    />
  )
}
