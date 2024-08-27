import * as React from 'react'
import Spinner from '../ActivityIndicator/Spinner'
import StyledToolbar from './StyledToolbar'

type Props = {
  hidden: boolean;
};

export default function EmptyToolbarWithLoadingIndicator(props: Props) {
  return (
    <StyledToolbar hidden={props.hidden} isSwipeable={false}>
      <Spinner size={20} />
    </StyledToolbar>
  )
}
