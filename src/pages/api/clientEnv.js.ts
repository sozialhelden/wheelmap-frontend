import * as env from '../../lib/env';
import { createEnvironmentJSResponseHandler } from '@sozialhelden/twelve-factor-dotenv';

export default createEnvironmentJSResponseHandler(env);
