import queryString from 'query-string';

export * from './storage';
export * from './storage';
export * from './desEncryt';

/**
 * @description Convert object thành query trên url
 */
export const stringtifyQuery = (object: object) => {
  return queryString.stringify(object, {
    skipEmptyString: true,
    skipNull: true,
  });
};

/** redirect sang dashboard hoặc redirect search ... */
export const handleRedirect = (path?: string) => {
  const params = new URLSearchParams(window.location.search);
  const redirectPath = path ?? decodeURIComponent(params.get('redirect') || '/');
  window.location.href = redirectPath;
}