import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEYS } from "@constants/storageKeys";
import { lcStorage } from "@utils/storage";

type UseI18nOptions = {
  ns?: string;
  prefix?: string;
};

type Lang = "vi" | "en" | "cn" | "jp" | "kr";

const messages: Record<string, string> = {
  total_items: "{{from}}-{{to}} / {{total}}",
  items_per_page: "/ trang",
};

const interpolate = (
  template: string,
  params?: Record<string, string | number | null | undefined>
) => {
  if (!params) return template;

  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replaceAll(`{{${key}}}`, String(value ?? ""));
  }, template);
};

export function useI18n(options?: UseI18nOptions) {
  const { prefix } = options || {};
  const [lang, setLang] = useState<Lang>(
    () => (lcStorage.get(LOCAL_STORAGE_KEYS.language) as Lang) || "vi"
  );

  useEffect(() => {
    lcStorage.set(LOCAL_STORAGE_KEYS.language, lang);
  }, [lang]);

  const t = (key: string, params?: Record<string, string | number>) => {
    const finalKey = prefix ? `${prefix}.${key}` : key;
    const message = messages[finalKey] ?? finalKey;
    return interpolate(message, params);
  };

  const changeLang = async (value: Lang) => {
    setLang(value);
  };

  return {
    t,
    i18n: {
      language: lang,
      changeLanguage: changeLang,
    },
    lang,
    changeLang,
  };
}

export default useI18n;
