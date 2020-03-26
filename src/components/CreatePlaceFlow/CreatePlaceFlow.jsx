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
import { accessibilityCloudFeatureCache } from '../../lib/cache/AccessibilityCloudFeatureCache';
import AppContext from '../../AppContext';

type Props = {
  onSubmit: () => void,
  onCancel: () => void,
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
  const appToken = 'ec196bd1cf8c265e09d62fbd4654b57e' || appContext.app.tokenString;

  const [step, setStep] = React.useState<Step>('PickPointGeometry');
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
    accessibilityCloudFeatureCache.createPlace(place, appToken).catch(console.error);
    setStep('Success');
  }, [place, appToken]);

  return (
    <>
      <PageStack>
        <ExistingPlacePicker
          visible={step === 'FindExistingPlace'}
          onSelectExisting={props.onCancel}
          onCancel={props.onCancel}
          onCreateNew={createNew}
        />

        <PlaceDetailsEditor
          visible={step === 'EditPlaceDetails'}
          place={place}
          onUpdateName={nameUpdated}
          onUpdateAddress={addressUpdated}
          onPickPointGeometry={pickPointGeometry}
          onPickCategory={pickCategory}
          onCancel={() => setStep('FindExistingPlace')}
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
          onSubmit={() => setStep('FindExistingPlace')}
        />
      </PageStack>
    </>
  );
};

export default CreatePlaceFlow;
