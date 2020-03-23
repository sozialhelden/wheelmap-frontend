// @flow
import * as React from 'react';

export type AddressData = {
  addressLine?: string,
  city?: string,
  region?: string,
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
      onUpdateAddress({ ...address, addressLine: e.target.value });
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
      onUpdateAddress({ ...address, region: e.target.value });
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
      <input value={address.addressLine || ''} onChange={onAddressLineChanged} type="text" />
      City
      <input value={address.city || ''} onChange={onCityChanged} type="text" />
      Region
      <input value={address.region || ''} onChange={onRegionChanged} type="text" />
      Postal Code
      <input value={address.postalCode || ''} onChange={onPostalCodeChanged} type="text" />
    </>
  );
};

export default AddressEditor;
