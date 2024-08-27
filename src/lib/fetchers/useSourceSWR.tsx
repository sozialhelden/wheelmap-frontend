import useSWR from 'swr';
import { useCurrentAppToken } from '../context/AppContext';
import fetchSource from './fetchSource';

export function useSourceSWR(_id?: string) {
  const appToken = useCurrentAppToken();
  return useSWR([appToken, _id], fetchSource);
}
