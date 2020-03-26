// @flow
import * as React from 'react';

import PageStack from './PageStack';
import ExistingPlacePicker from './pages/ExistingPlacePicker';
import CategoryPicker from './pages/CategoryPicker';
import PlaceDetailsEditor from './pages/PlaceDetailsEditor';
import PointGeometryPicker from './pages/PointGeometryPicker';
import CreationSuccessScreen from './pages/CreationSuccessScreen';

import type { PlaceData } from './pages/PlaceDetailsEditor';
import type { PointGeometry } from './pages/PointGeometryPicker';
import type { AddressData } from './components/AddressEditor';
import { type WheelmapResolvedSearchResultFeature } from './components/usePlaceSearchWithWheelmapResolution';
import { accessibilityCloudFeatureCache } from '../../lib/cache/AccessibilityCloudFeatureCache';
import AppContext from '../../AppContext';

type Props = {
  onSubmit: (createdPlaceId: string) => void,
  onCancel: (result?: WheelmapResolvedSearchResultFeature) => void,
};

type Step =
  | 'FindExistingPlace'
  | 'EditPlaceDetails'
  | 'PickPointGeometry'
  | 'PickCategory'
  | 'Success';

const CreatePlaceFlow = (props: Props) => {
  const { onCancel, onSubmit } = props;

  const appContext = React.useContext(AppContext);
  const appToken = appContext.app.tokenString;

  const [uploadState, setUploadState] = React.useState<'Submitting' | 'Success' | 'Error'>(
    'Submitting'
  );
  const [createdPlaceId, setCreatedPlaceId] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<Step>('FindExistingPlace');
  const [place, setPlace] = React.useState<PlaceData>({
    properties: {
      name: '',
      address: {},
    },
  });

  const createNew = React.useCallback(
    (name: string) => {
      const newPlace = { properties: { name, address: {} } };
      setPlace(newPlace);
      setStep('EditPlaceDetails');
    },
    [setPlace, setStep]
  );

  const returnToEditor = React.useCallback(() => {
    setStep('EditPlaceDetails');
  }, [setStep]);

  const pickPointGeometry = React.useCallback(() => {
    setStep('PickPointGeometry');
  }, [setStep]);

  const pickCategory = React.useCallback(() => {
    setStep('PickCategory');
  }, [setStep]);

  const categoryPicked = React.useCallback(
    (category: string) => {
      const clonedPlace = { ...place };
      clonedPlace.properties = { ...place.properties, category };
      setPlace(clonedPlace);
      setStep('EditPlaceDetails');
    },
    [place, setPlace, setStep]
  );

  const nameUpdated = React.useCallback(
    (name: string) => {
      const clonedPlace = { ...place };
      clonedPlace.properties = { ...place.properties, name };
      setPlace(clonedPlace);
    },
    [setPlace, place]
  );

  const addressUpdated = React.useCallback(
    (address: AddressData) => {
      const clonedPlace = { ...place };
      clonedPlace.properties = { ...place.properties, address };
      setPlace(clonedPlace);
    },
    [setPlace, place]
  );

  const pointGeometryPicked = React.useCallback(
    (geometry: PointGeometry) => {
      const clonedPlace = { ...place, geometry };
      setPlace(clonedPlace);
      setStep('EditPlaceDetails');
    },
    [place, setPlace, setStep]
  );

  const createPlace = React.useCallback(() => {
    setUploadState('Submitting');
    accessibilityCloudFeatureCache
      .createPlace(place, appToken)
      .then(id => {
        setCreatedPlaceId(id);
        setUploadState('Success');
      })
      .catch(() => setUploadState('Error'));
    setStep('Success');
  }, [place, appToken, setCreatedPlaceId, setUploadState]);

  const submit = React.useCallback(() => {
    if (createdPlaceId) {
      onSubmit(createdPlaceId);
    }
  }, [onSubmit, createdPlaceId]);

  return (
    <>
      <PageStack>
        <ExistingPlacePicker
          visible={step === 'FindExistingPlace'}
          onSelectExisting={onCancel}
          onCancel={onCancel}
          onCreateNew={createNew}
        />

        <PlaceDetailsEditor
          visible={step === 'EditPlaceDetails'}
          place={place}
          onUpdateName={nameUpdated}
          onUpdateAddress={addressUpdated}
          onPickPointGeometry={pickPointGeometry}
          onPickCategory={pickCategory}
          onCancel={onCancel}
          onSubmit={createPlace}
        />

        <CategoryPicker
          visible={step === 'PickCategory'}
          onSelected={categoryPicked}
          onCancel={returnToEditor}
        />

        <PointGeometryPicker
          visible={step === 'PickPointGeometry'}
          onSelected={pointGeometryPicked}
          onCancel={returnToEditor}
          category={place.properties.category}
          latitude={place.geometry ? place.geometry.coordinates[1] : undefined}
          longitude={place.geometry ? place.geometry.coordinates[0] : undefined}
        />

        <CreationSuccessScreen
          visible={step === 'Success'}
          state={uploadState}
          placeName={place.properties.name}
          onSubmit={submit}
          onRetry={returnToEditor}
        />
      </PageStack>
    </>
  );
};

export default CreatePlaceFlow;
