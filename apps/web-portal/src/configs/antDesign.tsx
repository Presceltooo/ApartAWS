import { Empty, notification } from "antd";
import locale from "antd/es/locale/vi_VN";
import type { ConfigProviderProps } from "antd/lib/config-provider";

// Mapping màu từ design — Theme B: Dark Violet (Admin / Dashboard)
export const colors = {
  // === Nền ===
  pageBg: "#0D0D1A",        // Void — Page background
  cardBg: "#1A1830",        // Deep Navy — Card background
  sidebarActive: "#26215C", // Dark Purple — Sidebar active

  // === Primary & Accent ===
  primary: "#534AB7",       // Violet — Primary CTA
  primarySub: "#7F77DD",    // Violet Lt — Accent, icon (hover state)
  primaryLight: "#AFA9EC",  // Lavender — Body text
  primaryMuted: "#CECBF6",  // Ghost — Muted text

  // === Semantic ===
  success: "#1D9E75",       // Teal — Success / up
  warning: "#EF9F27",       // Amber — Warning
  error: "#E24B4A",         // Red — Error / alert

  // === Text ===
  primaryText: "#CECBF6",   // Ghost — General body text on dark bg
  primaryTitle: "#AFA9EC",  // Lavender — Heading / label text
  primarySubtitle: "#7F77DD", // Violet Lt — Secondary text

  // === Border & UI ===
  primaryBorder: "rgba(175, 169, 236, 0.2)", // Subtle violet border
  primaryBg: "#0D0D1A",     // Page bg alias
  primaryBgSub: "#1A1830",  // Card bg alias (table header, panel)
  bgHover: "#26215C",       // Dark Purple — Hover background
  bgHighlight: "#534AB7",   // Violet — Highlight

  // === Misc ===
  disabled: "#26215C",      // Dark Purple — Disabled background
  textDisabled: "rgba(175, 169, 236, 0.4)",
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
      fontSize: 14, // Giảm xuống 14px chuẩn UI hiện đại (16px hơi to thô), nếu cần to dùng fontSizeLG
      fontSizeLG: 16,
      fontFamily: "Roboto, sans-serif",

      // Màu chủ đạo
      colorPrimary: colors.primary,
      colorInfo: colors.primary,
      colorLink: colors.primary,

      // Màu nền và viền
      colorBgBase: colors.white,
      colorBorder: colors.primaryBorder,
      colorText: colors.primaryTitle,
      colorTextSecondary: colors.primarySubtitle,
      colorTextPlaceholder: "rgba(0, 0, 0, 0.35)", // Placeholder rõ hơn chút

      // Disabled
      colorBgContainerDisabled: colors.disabled,
      colorTextDisabled: colors.textDisabled,

      borderRadius: 6, // Tăng nhẹ bo góc cho mềm mại (4px hơi cứng)
      controlHeight: 40, // Đảm bảo size large đồng bộ
    },
    components: {
      Input: {
        activeBorderColor: colors.primary,
        hoverBorderColor: colors.primarySub,
        colorBgContainerDisabled: colors.disabled,
        colorTextDisabled: colors.textDisabled,
        controlOutline: "rgba(83, 74, 183, 0.2)", // Hiệu ứng glow tím nhẹ khi focus
      },
      InputNumber: {
        activeBorderColor: colors.primary,
        hoverBorderColor: colors.primarySub,
        controlOutline: "rgba(83, 74, 183, 0.2)",
      },
      Select: {
        colorPrimary: colors.primary,
        optionSelectedColor: colors.primary,
        optionSelectedBg: colors.bgHover, // Nền item đã chọn
        controlOutline: "rgba(83, 74, 183, 0.2)",
      },
      DatePicker: {
        colorPrimary: colors.primary,
        cellActiveWithRangeBg: colors.bgHover,
        cellHoverWithRangeBg: colors.bgHover,
      },
      Table: {
        headerBg: colors.primaryBgSub, // Dùng màu hồng phấn nhạt thay vì xám chết -> Tone-sur-tone
        headerColor: colors.primaryTitle,
        headerBorderRadius: 6,
        borderColor: colors.primaryBorder,
        rowHoverBg: colors.primaryBg,
        rowExpandedBg: colors.primaryBg,
      },
      Badge: {
        colorError: colors.primary,
        colorPrimary: colors.primary,
      },
      Tooltip: {
        colorBgSpotlight: colors.primarySub, // Tooltip đậm hơn chút cho dễ đọc
      },
      Collapse: {
        headerBg: colors.primaryBgSub, // Header collapse đồng bộ với table
        contentBg: colors.white,
        borderRadiusLG: 6,
      },
      Button: {
        // Primary Button
        colorPrimary: colors.primary,
        colorPrimaryHover: colors.primarySub,
        colorPrimaryActive: colors.primarySub,
        primaryShadow: "0 2px 0 rgba(83, 74, 183, 0.2)", // Shadow tím nhẹ

        // Default Button
        defaultColor: colors.primaryTitle,
        defaultBorderColor: colors.primaryBorder,
        defaultHoverBorderColor: colors.primary,
        defaultHoverColor: colors.primary,
      },
      Checkbox: {
        colorPrimary: colors.primary,
        colorPrimaryHover: colors.primary,
      },
      Radio: {
        colorPrimary: colors.primary,
        buttonSolidCheckedBg: colors.primary,
      },
      Tabs: {
        itemColor: colors.primarySubtitle,
        itemSelectedColor: colors.primary,
        itemHoverColor: colors.primarySub,
        inkBarColor: colors.primary,
      },
      Pagination: {
        itemActiveBg: colors.white,
        colorPrimary: colors.primary,
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

// Mapping màu từ design — Theme User: Orange / Yellow (Cam / Vàng)
export const userColors = {
  // === Nền ===
  pageBg: "#1A0D00",        // Rất tối cam
  cardBg: "#30180A",        // Nền card nâu tối
  sidebarActive: "#5C2B0B", // Nâu xám

  // === Primary & Accent ===
  primary: "#FA8C16",       // Volcano 6 (Cam) — Primary CTA
  primarySub: "#FF9C6E",    // Volcano 4 — Accent
  primaryLight: "#FFD666",  // Vàng sáng — Body text / Title
  primaryMuted: "#FFE7BA",  // Vàng nhạt — Muted text

  // === Semantic ===
  success: "#1D9E75",       // Teal — Success / up
  warning: "#EF9F27",       // Amber — Warning
  error: "#E24B4A",         // Red — Error / alert

  // === Text ===
  primaryText: "#FFE7BA",   
  primaryTitle: "#FFD666",  
  primarySubtitle: "#FF9C6E", 

  // === Border & UI ===
  primaryBorder: "rgba(250, 140, 22, 0.2)", // Subtle orange border
  primaryBg: "#1A0D00",     
  primaryBgSub: "#30180A",  
  bgHover: "#5C2B0B",       
  bgHighlight: "#FA8C16",   

  // === Misc ===
  disabled: "#5C2B0B",      
  textDisabled: "rgba(250, 140, 22, 0.4)",
  white: "#ffffff",
};

export const userAntdConfig: ConfigProviderProps = {
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
      colorPrimary: userColors.primary,
      colorInfo: userColors.primary,
      colorLink: userColors.primary,
      colorBgBase: userColors.white,
      colorBorder: userColors.primaryBorder,
      colorText: userColors.primaryTitle,
      colorTextSecondary: userColors.primarySubtitle,
      colorTextPlaceholder: "rgba(0, 0, 0, 0.35)", 
      colorBgContainerDisabled: userColors.disabled,
      colorTextDisabled: userColors.textDisabled,
      borderRadius: 6, 
      controlHeight: 40, 
    },
    components: {
      Input: {
        activeBorderColor: userColors.primary,
        hoverBorderColor: userColors.primarySub,
        colorBgContainerDisabled: userColors.disabled,
        colorTextDisabled: userColors.textDisabled,
        controlOutline: "rgba(250, 140, 22, 0.2)", 
      },
      Button: {
        colorPrimary: userColors.primary,
        colorPrimaryHover: userColors.primarySub,
        colorPrimaryActive: userColors.primarySub,
        primaryShadow: "0 2px 0 rgba(250, 140, 22, 0.2)", 
        defaultColor: userColors.primaryTitle,
        defaultBorderColor: userColors.primaryBorder,
        defaultHoverBorderColor: userColors.primary,
        defaultHoverColor: userColors.primary,
      },
    },
  },
};
