// @flow
import * as React from 'react';
import styled from 'styled-components';
import { t } from 'ttag';
import { Dots } from 'react-activity';

import SearchResult from '../../SearchToolbar/SearchResult.js';

import VerticalPage from '../components/VerticalPage';
import usePlaceSearchWithWheelmapResolution, {
  type WheelmapResolvedSearchResultFeature,
} from '../components/usePlaceSearchWithWheelmapResolution';
import { ChromelessButton } from '../../Button';
import colors from '../../../lib/colors';
import InputField from '../components/InputField';
import AppContext from '../../../AppContext.js';
import PageHeader from '../components/PageHeader.jsx';

type Props = {
  className?: string,
  visible: boolean,
  onSelectExisting: (result: WheelmapResolvedSearchResultFeature) => void,
  onCancel: () => void,
  onCreateNew: (searchString: string) => void,
};

const ExistingPlacePicker = (props: Props) => {
  const { className, visible, onCancel, onCreateNew, onSelectExisting } = props;

  const appContext = React.useContext(AppContext);

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
      <PageHeader>
        <ChromelessButton onClick={onCancelled}>{t`Cancel`}</ChromelessButton>
        <h2>{t`Create Place`}</h2>
      </PageHeader>

      <InputField value={searchString} onChange={onSearchStringChanged} type="text" />
      {!canCreateNewPlace && (
        <div className="action-hint">{t`Check if the place already exists by searching for it`}</div>
      )}
      {canCreateNewPlace && (
        <>
          <div className="action-hint">{t`No matching result?`}</div>
          <ChromelessButton onClick={onCreateClicked}>
            {t`Create a new place with this name`}
          </ChromelessButton>
        </>
      )}

      <div className="search-block">
        {searchState === 'Error' && (
          <div className="search-state error">{t`An error occurred while searching`}</div>
        )}
        {searchState === 'TypeMore' && (
          <div className="search-state type-more">{t`Type more to start searching`}</div>
        )}
        {searchState === 'Loading' && (
          <div className="search-state loading">
            <div>
              <Dots size={30} color={'rgba(0, 0, 0, 0.4)'} />
            </div>
            {t`Searching...`}
          </div>
        )}
        {searchResults && (
          <ul>
            {searchResults.map((result, index) => {
              return (
                <SearchResult
                  key={index}
                  feature={result.searchResult}
                  wheelmapFeature={result.wheelmapFeature}
                  categories={appContext.categories}
                  hidden={false}
                  onClick={() => onSelectExisting(result)}
                />
              );
            })}
          </ul>
        )}
      </div>
    </VerticalPage>
  );
};

export default styled(ExistingPlacePicker)`
  > .action-hint {
    color: ${colors.textMuted};
    text-align: center;
  }

  > .search-block {
    margin-top: 24px;
    border-top: 1px solid ${colors.textMuted};
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;

    > .search-state {
      color: ${colors.textMuted};
      text-align: center;
      padding: 48px;
      font-weight: bold;

      > div {
        margin: 12px;
      }
    }

    ul {
      align-self: flex-start;
      list-style-type: none;
      margin: 0;
      padding: 0;
      width: 100%;

      > li {
        width: 100%;
      }
    }
  }

  ${ChromelessButton} {
    font-weight: bold;
    color: ${colors.linkColor};
  }
`;
