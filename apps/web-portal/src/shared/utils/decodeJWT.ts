export type AppJwtPayload = {
  userId: number;
  username: string;
  roles: string[];
  exp: number;
  DonViId: number;
};

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );
  return decodeURIComponent(escape(atob(padded)));
};

export const getJwtValue = <K extends keyof AppJwtPayload>(
  token: string | null,
  key: K
): AppJwtPayload[K] | null => {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const decoded = JSON.parse(decodeBase64Url(payload)) as AppJwtPayload;
    return decoded[key] ?? null;
  } catch {
    return null;
  }
};
