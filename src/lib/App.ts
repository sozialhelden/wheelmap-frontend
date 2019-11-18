import { ClientSideConfiguration } from './ClientSideConfiguration';

export type App = {
  _id: string,
  organizationId: string,
  name: string,
  clientSideConfiguration: ClientSideConfiguration,
  tokenString: string,
};
