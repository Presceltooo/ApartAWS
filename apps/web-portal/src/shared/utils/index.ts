import queryString from 'query-string';

export * from './storage';
export * from './storage';
export * from './desEncryt';

/**
 * @description Convert object thành query trên url
 */
export const stringtifyQuery = (object: object) => {
  const flattened = flattenQuery(object);
  return queryString.stringify(flattened, {
    skipEmptyString: true,
    // skipNull: true,
  });
};

/** redirect sang dashboard hoặc redirect search ... */
export const handleRedirect = (path?: string) => {
  const params = new URLSearchParams(window.location.search);
  //login cũ
  // const redirectPath = path ?? decodeURIComponent(params.get('redirect') || '/')
  const redirectCandidate = path ?? params.get('redirect');
  const redirectPath = redirectCandidate ? decodeURIComponent(redirectCandidate) : '/admin';
  window.location.href = redirectPath;
}

const flattenQuery = (input:object) => {
  const result: Record<string, unknown> = {};
  Object.entries(input).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.entries(value).forEach(([childKey, childValue]) => {
        const dotKey = `${key}.${childKey}`;
        result[dotKey] = childValue === null ? null : childValue;
      });
    } else {
      result[key] = value;
    }
  });
  return result;
};

export const objectToFormData = (object: object) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(object)) {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        for (const item of value) {
          formData.append(key, item);
        }
      } else {
        formData.append(key, value);
      }
    }
  }

  return formData;
};
