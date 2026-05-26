import { useTranslation } from "react-i18next";
import { LOCAL_STORAGE_KEYS } from "@constants/storageKeys";
import { lcStorage } from "@utils/storage";

type UseI18nOptions = {
  ns?: string;
  prefix?: string;
};

type Lang = "vi" | "en" | "cn" | "jp" | "kr";

export function useI18n(options?: UseI18nOptions) {
  const { ns = "common", prefix } = options || {};
  const { t: translate, i18n } = useTranslation(ns);

  const t = (key: string, params?: Record<string, string | number>) => {
    const finalKey = prefix ? `${prefix}.${key}` : key;
    return translate(finalKey, params);
  };

  const changeLang = async (value: Lang) => {
    await i18n.changeLanguage(value);
    lcStorage.set(LOCAL_STORAGE_KEYS.language, value);
  };

  return {
    t,
    i18n,
    lang: i18n.language as Lang,
    changeLang,
  };
}

export default useI18n;
