import { Empty, notification } from "antd";
import locale from "antd/es/locale/vi_VN";
import type { ConfigProviderProps } from "antd/lib/config-provider";

// Mapping màu từ design — Theme A: Terracotta + Warm (User-facing & Admin Unified)
export const colors = {
  // === Nền (Backgrounds) ===
  pageBg: "#F5F0EA",        // Cream — Page background
  cardBg: "#FFFFFF",        // White — Card background (standard for light theme)
  sidebarActive: "#FAEEDA", // Amber Lt — Sidebar active / highlight

  // === Primary & Terracotta ===
  primary: "#D85A30",       // Terracotta — Primary CTA
  primaryHover: "#F0997B",  // Terracotta Lt — Hover state
  primaryActive: "#993C1D", // Terracotta Dk — Pressed state
  
  // === Semantic ===
  success: "#639922",       // Green — Success
  successBg: "#EAF3DE",     // Sage Green — Success background
  warning: "#BA7517",       // Amber — Warning
  warningBg: "#FAEEDA",     // Amber Lt — Warning background
  error: "#712B13",         // Rust — Error / Booked
  errorBg: "#FFDBCF",       // Subtle red for error backgrounds

  // === Text ===
  textPrimary: "#4A1B0C",   // Ink Brown — Main headings / title
  textSecondary: "#8C7169", // Muted terracotta-brown for subtext
  textPlaceholder: "rgba(74, 27, 12, 0.45)",

  // === Border & UI ===
  border: "#993C1D",        // Terracotta Dk for active borders
  borderSubtle: "rgba(153, 60, 29, 0.15)", // Subtle terracotta border
  white: "#ffffff",
};

const antdDefaultConfig: ConfigProviderProps = {
  locale: locale,
  componentSize: "large",
  form: { colon: false },
  space: { size: 12 },
  renderEmpty: () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="Không có dữ liệu"
    />
  ),
  theme: {
    token: {
      fontSize: 14,
      fontSizeLG: 16,
      fontFamily: "Roboto, sans-serif",

      // Theme colors
      colorPrimary: colors.primary,
      colorInfo: colors.primary,
      colorLink: colors.primary,
      colorSuccess: colors.success,
      colorWarning: colors.warning,
      colorError: colors.error,

      // Layout colors
      colorBgBase: colors.white,
      colorBgLayout: colors.pageBg,
      colorBorder: colors.borderSubtle,
      colorText: colors.textPrimary,
      colorTextSecondary: colors.textSecondary,
      colorTextPlaceholder: colors.textPlaceholder,

      borderRadius: 8, // Thể hiện sự mềm mại của theme Warm
      controlHeight: 40,
    },
    components: {
      Input: {
        activeBorderColor: colors.primary,
        hoverBorderColor: colors.primaryHover,
        controlOutline: "rgba(216, 90, 48, 0.1)", // Terracotta glow
      },
      Button: {
        colorPrimary: colors.primary,
        colorPrimaryHover: colors.primaryHover,
        colorPrimaryActive: colors.primaryActive,
        primaryShadow: "0 2px 0 rgba(216, 90, 48, 0.1)",
      },
      Table: {
        headerBg: colors.sidebarActive, // Dùng Amber Lt cho header table
        headerColor: colors.textPrimary,
        headerBorderRadius: 8,
        borderColor: colors.borderSubtle,
        rowHoverBg: colors.pageBg,
      },
      Menu: {
        itemSelectedBg: colors.sidebarActive,
        itemSelectedColor: colors.primary,
      },
      Tabs: {
        itemSelectedColor: colors.primary,
        inkBarColor: colors.primary,
        itemHoverColor: colors.primaryHover,
      },
      Modal: {
        titleFontSize: 18,
        headerBg: colors.white,
      },
    },
  },
};

notification.config({
  maxCount: 5,
  placement: "topRight",
});

export default antdDefaultConfig;

