import {
  CloseOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Popover } from "antd";
import React, { useState } from "react";

interface FilterPopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  content: React.ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  placement?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight";
  trigger?: "hover" | "focus" | "click";
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  children,
  open,
  onOpenChange,
  content,
  onSearch,
  onReset,
  placement = "bottomRight",
  trigger = "click",
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const popoverOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const handleClose = () => {
    handleOpenChange(false);
  };

  const handleSearch = () => {
    onSearch?.();
    handleClose();
  };

  const handleReset = () => {
    onReset?.();
    onSearch?.();
  };

  const popoverContent = (
    <div>
      {/* Content */}
      <div style={{ padding: 14 }}>{content}</div>

      {/* Footer Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          padding: 12,
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Nhập lại
        </Button>
        <Button icon={<CloseOutlined />} onClick={handleClose}>
          Đóng
        </Button>
        <Button
          type="primary"
          style={{
            backgroundColor: "var(--primary)",
          }}
          icon={<SearchOutlined />}
          onClick={handleSearch}
        >
          Tìm
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger={trigger}
      open={popoverOpen}
      onOpenChange={handleOpenChange}
      placement={placement}
    >
      {children}
    </Popover>
  );
};
