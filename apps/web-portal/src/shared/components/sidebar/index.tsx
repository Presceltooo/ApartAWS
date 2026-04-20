// import { findExactRoute } from "@/shared/utils/getMenuAdmin";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useLocation } from "@tanstack/react-router";
import { Button, Menu, Tooltip, type MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { SidebarWrapper } from "./styled";
import type { SidebarProps } from "./types";
import useHandle from "./useHandle";

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  menuItems,
  title = "",
}) => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { findParents, handleMenuClick, renderCollapsedMenuItem } = useHandle();

  // Handle Accordion Logic: Only allow one submenu to be open at a time
  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    // Get list of root menu keys
    const rootSubmenuKeys = menuItems?.map((item) => item.key) || [];

    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  useEffect(() => {
    const currentPath = location.href;
    const parentKeys = findParents(menuItems, currentPath) || [];
    // const exactRoute = findExactRoute(menuItems, location.href);
    // if (exactRoute) {
    //   setSelectedKeys(exactRoute.key ? [exactRoute.key] : []);
    //   if (parentKeys?.length > 0) {
    //     setOpenKeys(parentKeys);
    //   }
    //   return;
    // }

    // Fallback if no exact route found (optional based on your logic)
    if (parentKeys.length > 0) {
      setSelectedKeys(parentKeys);
      setOpenKeys(parentKeys.slice(0, -1));
    }
  }, [location.pathname, menuItems]);
  return (
    <SidebarWrapper collapsed={collapsed}>
      <div className="sidebar-header">
        <Button
          type="text"
          icon={
            collapsed ? (
              <MenuUnfoldOutlined style={{ color: "var(--primary)" }} />
            ) : (
              <MenuFoldOutlined style={{ color: "var(--primary)" }} />
            )
          }
          onClick={onToggle}
          className="collapse-btn"
        />
        {!collapsed && <Tooltip title={title}><div className="sidebar-header-title">{title}</div></Tooltip>}
      </div>

      {collapsed ? (
        <div className="collapsed-icons">
          {menuItems?.map(renderCollapsedMenuItem)}
        </div>
      ) : (
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          items={menuItems as any}
          onClick={(e) => handleMenuClick(e as any)}
          className="sidebar-menu"
        />
      )}
    </SidebarWrapper>
  );
};
export default Sidebar;
