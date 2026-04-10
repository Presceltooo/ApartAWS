import { lcStorage } from '@utils/storage';
import { LOCAL_STORAGE_KEYS } from '@constants/storageKeys';
import { decryptDES, encryptDES } from '@utils/desEncryt';

const tokenManager = () => { 
  let accessToken: string | undefined = lcStorage.get(LOCAL_STORAGE_KEYS.accessToken);
  let refreshToken: string | undefined = lcStorage.get(LOCAL_STORAGE_KEYS.refreshToken);

  const getAccessToken = (): string | undefined => {
    if (!accessToken) return undefined;
    try {
      if (import.meta.env.NODE_ENV === 'development') {
        return accessToken;
      } else {
        return decryptDES(accessToken);
      }
    } catch {
      return undefined;
    }
  };

  const setAccessToken = (token: string): void => {
    if (import.meta.env.NODE_ENV === 'development') {
      accessToken = token;
    } else {
      accessToken = encryptDES(token);
    }
    lcStorage.set(LOCAL_STORAGE_KEYS.accessToken, accessToken);
  };

  const removeAccessToken = (): void => {
    accessToken = undefined;
    localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
  };

  const getRefreshToken = () => {
    if (!refreshToken) return undefined;
    if (import.meta.env.NODE_ENV === 'development') {
      return refreshToken;
    } else {
      return decryptDES(refreshToken);
    }
  };

  const setRefreshToken = (token: string): void => {
    if (import.meta.env.NODE_ENV === 'development') {
      refreshToken = token;
    } else {
      refreshToken = encryptDES(token);
    }
    lcStorage.set(LOCAL_STORAGE_KEYS.refreshToken, refreshToken);
  };

  const removeRefreshToken = (): void => {
    refreshToken = undefined;
    localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
  };

  return {
    getAccessToken,
    setAccessToken,
    removeAccessToken,
    getRefreshToken, 
    setRefreshToken,
    removeRefreshToken
  }
}

export default tokenManager();