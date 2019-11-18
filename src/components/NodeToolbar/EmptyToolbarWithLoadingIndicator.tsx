import * as React from 'react';
import { Dots } from 'react-activity';
import StyledToolbar from './StyledToolbar';

type Props = {
  hidden: boolean,
};

export default function EmptyToolbarWithLoadingIndicator(props: Props) {
  return (
    <StyledToolbar hidden={props.hidden} isSwipeable={false}>
      <Dots size={20} />
    </StyledToolbar>
  );
}
