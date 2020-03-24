// @flow
import * as React from 'react';

export type AddressData = {
  text?: string,
  city?: string,
  regions?: [string],
  postalCode?: string,
};

type Props = {
  address: AddressData,
  onUpdateAddress: (address: AddressData) => void,
};

const AddressEditor = (props: Props) => {
  const { address, onUpdateAddress } = props;

  const onAddressLineChanged = React.useCallback(
    (e: React.ChangeEvent) => {
      onUpdateAddress({ ...address, text: e.target.value });
    },
    [address, onUpdateAddress]
  );

  const onCityChanged = React.useCallback(
    (e: React.ChangeEvent) => {
      onUpdateAddress({ ...address, city: e.target.value });
    },
    [address, onUpdateAddress]
  );

  const onRegionChanged = React.useCallback(
    (e: React.ChangeEvent) => {
      onUpdateAddress({ ...address, regions: [e.target.value] });
    },
    [address, onUpdateAddress]
  );

  const onPostalCodeChanged = React.useCallback(
    (e: React.ChangeEvent) => {
      onUpdateAddress({ ...address, postalCode: e.target.value });
    },
    [address, onUpdateAddress]
  );

  return (
    <>
      Address
      <input value={address.text || ''} onChange={onAddressLineChanged} type="text" />
      City
      <input value={address.city || ''} onChange={onCityChanged} type="text" />
      Region
      <input
        value={(address.regions && address.regions[0]) || ''}
        onChange={onRegionChanged}
        type="text"
      />
      Postal Code
      <input value={address.postalCode || ''} onChange={onPostalCodeChanged} type="text" />
    </>
  );
};

export default AddressEditor;
