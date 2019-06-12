import { type EmbedToken } from './ClientSideConfiguration';

const isEmbedTokenValid = async (embedToken: ?string, appEmbedTokens: ?(EmbedToken[])) => {
  if (!embedToken || !appEmbedTokens) {
    return false;
  }

  const embedTokenFound = appEmbedTokens.find(token => token.token === embedToken);

  if (embedTokenFound) {
    const now = new Date();
    const expiryDate = new Date(embedToken.expiresOn);
    return expiryDate > now;
  }

  return false;
};

export default isEmbedTokenValid;
