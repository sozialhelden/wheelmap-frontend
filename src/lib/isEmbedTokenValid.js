import { type EmbedToken } from './ClientSideConfiguration';

const isEmbedTokenValid = async (embedToken: ?string, appEmbedTokens: ?(EmbedToken[])) => {
  if (!embedToken || !appEmbedTokens) {
    return false;
  }

  const matchingToken = appEmbedTokens.find(token => token.token === embedToken);

  if (matchingToken) {
    const now = new Date();
    const expiryDate = new Date(matchingToken.expiresOn);
    return expiryDate > now;
  }

  return false;
};

export default isEmbedTokenValid;
