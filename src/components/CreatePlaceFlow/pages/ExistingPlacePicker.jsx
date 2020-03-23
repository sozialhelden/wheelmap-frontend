// @flow
import * as React from 'react';
import VerticalPage from '../components/VerticalPage';

type Props = {
  visible: boolean,
  onSelectExisting: (id: string | number) => void,
  onCancel: () => void,
  onCreateNew: (searchString: string) => void,
};

const ExistingPlacePicker = (props: Props) => {
  const { visible, onCancel, onCreateNew, onSelectExisting } = props;

  const [searchString, setSearchString] = React.useState<string>('');
  const onSearchStringChanged = React.useCallback(
    (e: React.ChangeEvent) => {
      setSearchString(e.target.value);
    },
    [setSearchString]
  );

  const onCancelled = React.useCallback(() => onCancel(), [onCancel]);
  const onCreateClicked = React.useCallback(() => onCreateNew(searchString), [
    onCreateNew,
    searchString,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <VerticalPage>
      ExistingPlacePicker
      <button onClick={onCancelled}>Cancel</button>
      <input value={searchString} onChange={onSearchStringChanged} type="text" />
      <button onClick={onCreateClicked}>Create New</button>
      <li>
        <button onClick={() => onSelectExisting('xde42Pbf9XNe2eHKK')}>Existing 1</button>
      </li>
    </VerticalPage>
  );
};

export default ExistingPlacePicker;
