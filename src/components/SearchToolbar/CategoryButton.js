// @flow

import * as React from 'react';
import { NavLink } from 'react-router-dom';
import IconButton from '../../lib/IconButton';
import * as icons from '../icons/mainCategories';


type Props = {
  name: string,
  id: string,
  className: string,
};


export default function CategoryButton(props: Props) {
  const url = `/beta/categories/${props.id}`;
  const SvgComponent = icons[props.id || 'undefined'];

  return (<NavLink activeClassName="active" to={url} className={props.className} onFocus={props.onFocus} onBlur={props.onBlur}>
    <IconButton iconComponent={<SvgComponent />} caption={props.name} />
  </NavLink>);
}
