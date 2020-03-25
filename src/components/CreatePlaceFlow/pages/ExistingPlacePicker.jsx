// @flow
import * as React from 'react';
import VerticalPage from '../components/VerticalPage';
import styled from 'styled-components';

import usePlaceSearchWithWheelmapResolution, {
  type WheelmapResolvedSearchResultFeature,
} from '../components/usePlaceSearchWithWheelmapResolution';

type Props = {
  className?: string,
  visible: boolean,
  onSelectExisting: (result: WheelmapResolvedSearchResultFeature) => void,
  onCancel: () => void,
  onCreateNew: (searchString: string) => void,
};

const ExistingPlacePicker = (props: Props) => {
  const { className, visible, onCancel, onCreateNew, onSelectExisting } = props;

  const [
    searchState,
    searchResults,
    searchString,
    setSearchString,
  ] = usePlaceSearchWithWheelmapResolution();
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

  const canCreateNewPlace = searchState !== 'TypeMore' && searchState !== 'Loading';

  return (
    <VerticalPage className={className}>
      <header>
        <button onClick={onCancelled}>Cancel</button>
        <h2>Create Place</h2>
      </header>

      <input value={searchString} onChange={onSearchStringChanged} type="text" />
      <span>Check if the place already exists by searching for it</span>
      <button onClick={onCreateClicked} disabled={!canCreateNewPlace}>
        Create a new place with this name
      </button>
      {searchState === 'Error' && <span>An error occurred while searching</span>}
      {searchState === 'TypeMore' && <span>Type more to start searching</span>}
      {searchState === 'Loading' && <span>Searching...</span>}
      {searchResults && (
        <ul>
          {searchResults.map((result, index) => {
            return (
              <li key={index}>
                <button onClick={() => onSelectExisting(result)}>{JSON.stringify(result)}</button>
              </li>
            );
          })}
        </ul>
      )}
    </VerticalPage>
  );
};

export default styled(ExistingPlacePicker)`
  > header {
    display: flex;
    flex-direction: row;
  }
`;
