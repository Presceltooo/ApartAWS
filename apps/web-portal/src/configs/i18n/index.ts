import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import locales
import viCommon from "./locales/vi/common.json";
import viAuth from "./locales/vi/auth.json";
import viPortal from "./locales/vi/portal.json";
import viAdmin from "./locales/vi/admin.json";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enPortal from "./locales/en/portal.json";
import enAdmin from "./locales/en/admin.json";

import jaCommon from "./locales/ja/common.json";
import jaAuth from "./locales/ja/auth.json";
import jaPortal from "./locales/ja/portal.json";
import jaAdmin from "./locales/ja/admin.json";

import koCommon from "./locales/ko/common.json";
import koAuth from "./locales/ko/auth.json";
import koPortal from "./locales/ko/portal.json";
import koAdmin from "./locales/ko/admin.json";

import zhCommon from "./locales/zh/common.json";
import zhAuth from "./locales/zh/auth.json";
import zhPortal from "./locales/zh/portal.json";
import zhAdmin from "./locales/zh/admin.json";

const resources = {
  vi: {
    common: viCommon,
    auth: viAuth,
    portal: viPortal,
    admin: viAdmin,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    portal: enPortal,
    admin: enAdmin,
  },
  ja: {
    common: jaCommon,
    auth: jaAuth,
    portal: jaPortal,
    admin: jaAdmin,
  },
  ko: {
    common: koCommon,
    auth: koAuth,
    portal: koPortal,
    admin: koAdmin,
  },
  zh: {
    common: zhCommon,
    auth: zhAuth,
    portal: zhPortal,
    admin: zhAdmin,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "vi",
  fallbackLng: "vi",
  ns: ["common", "auth", "portal", "admin"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
