import { useNavigate } from "@tanstack/react-router";
import type { MenuProps } from "antd";
import { Popover, Tooltip } from "antd";
import { PopoverMenuWrapper } from "./styled";
import type { AppMenuItem } from "./types";

export const useHandle = () => {
  const navigate = useNavigate();
  const navigateTo = (key: string, menuId?: number) => { 
    const keyParts = key.split("?")[0]; // Remove query params if any
    const search = key.split("?")[1] || "";
    const params = Object.fromEntries(new URLSearchParams(search));
    if (key.startsWith("/quan-ly-tich-hop/quan-ly-diem-ket-noi/")) {
      const ma = key.split("/").pop();

      if (ma && ma !== "undefined") {
        navigate({
          to: key,
          params: { ma },
        });
        return;
      }
    }
    if (key.startsWith("/sau-tiep-nhan/")) {
      const status = keyParts.split("/").pop();
      if (status && status !== "undefined") {
        navigate({
          to: keyParts,
          params: { status },
          search: { ...params, menuId: menuId },
        });
        return;
      }
    }
    if (key.startsWith("/xu-ly-pakn/")) {
      const status = keyParts.split("/").pop();
      if (status && status !== "undefined") {
        navigate({ to: keyParts, params: { status }, search: params });
        return;
      }
    }
    navigate({
      to: keyParts as any,
      search: params as any,
    });
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigateTo(e.key, (e.item as any).props.menuId);
  };
  const normalizeRoute = (route: string): string => {
    if (!route.includes("/xem-chi-tiet")) return route;
    const [pathPart, queryPart] = route.split("?");
    const basePath = pathPart.split("/xem-chi-tiet")[0];
    return queryPart ? `${basePath}?${queryPart}` : basePath;
  };
  const findParents = (
    items: AppMenuItem[] | undefined,
    path: string,
    parents: string[] = [],
  ): string[] | null => {
    if (!items) return null;
    const normalizedPath = normalizeRoute(path);
    for (const item of items) {
      if (!item) continue;
      if (
        item.key === normalizedPath ||
        normalizedPath?.includes(item.key) ||
        item.key?.includes(normalizedPath)
      )
        return [...parents, item.key];

      if (item.children && item.children.length > 0) {
        const result = findParents(item.children, path, [...parents, item.key]);
        if (result) return result;
      }
    }
    return null;
  };

  const createPopoverContent = (children?: AppMenuItem[]) => (
    <PopoverMenuWrapper>
      {children?.map(
        (child) =>
          child && (
            <div key={child.key}>
              {child.children?.length ? (
                <div className="my-popover-header">
                  <div className="popover-header">
                    {child.icon} {child.label}
                  </div>

                  <div className="my-submenu">
                    {child.children.map((grandChild) => (
                      <div
                        key={grandChild.key}
                        onClick={() => navigateTo(grandChild.key)}
                        className="popover-submenu-item"
                      >
                        {grandChild.label}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => navigateTo(child.key)}
                  className="popover-item"
                >
                  {child.icon} {child.label}
                </div>
              )}
            </div>
          ),
      )}
    </PopoverMenuWrapper>
  );

  const renderCollapsedMenuItem = (item: AppMenuItem) => {
    if (item.children?.length) {
      return (
        <Popover
          key={item.key}
          content={createPopoverContent(item.children)}
          trigger="hover"
          placement="rightTop"
        >
          <div className="collapsed-menu-item">{item.icon}</div>
        </Popover>
      );
    }

    return (
      <Tooltip key={item.key} title={item.label} placement="right">
        <div
          className="collapsed-menu-item"
          onClick={() => navigateTo(item.key)}
        >
          {item.icon}
        </div>
      </Tooltip>
    );
  };

  return {
    navigateTo,
    findParents,
    handleMenuClick,
    createPopoverContent,
    renderCollapsedMenuItem,
  };
};
export default useHandle;
