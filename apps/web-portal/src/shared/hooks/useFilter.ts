import type { TablePaginationConfig } from "antd";
import useI18n from "@/shared/hooks/useI18n";
import type { IBaseFilter } from "@shared/types";
import { useState } from "react";

const useFilter = <T extends IBaseFilter = IBaseFilter>(initialFilter: T) => {
  const [filter, setFilter] = useState<T>(initialFilter);
  const { t } = useI18n();

  const handleFilter = (values: any) => {
    setFilter({
      ...initialFilter,
      ...values,
    });
  };

  const handleClearFilter = () => {
    setFilter(initialFilter);
  };

  const pagination = (totalRecords?: number) => ({
    current: filter.page,
    pageSize: filter.pageSize,
    total: totalRecords,
    showSizeChanger: true,

    onChange: (page: number, pageSize: number) => {
      setFilter((prev: T) => ({
        ...prev,
        page,
        pageSize,
      }));
    },
    showTotal: (total: number, range: [number, number]) =>
      t("total_items", {
        from: range[0],
        to: range[1],
        total,
      }),
    locale: {
      items_per_page: t("items_per_page"),
    },
    onShowSizeChange: (_: number, pageSize: number) => {
      setFilter((prev: T) => ({
        ...prev,
        page: 1,
        pageSize,
      }));
    },
  } satisfies TablePaginationConfig);

  return { filter, setFilter, handleClearFilter, pagination, handleFilter };
};

export default useFilter;
