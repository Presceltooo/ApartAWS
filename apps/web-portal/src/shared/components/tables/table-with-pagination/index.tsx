import type { TableProps } from "antd";
import { Skeleton, Table } from "antd";
import { forwardRef, useEffect, useState } from "react";
import { TableWrapper } from "./styled";

export interface ITableWithPagination<T = any> extends TableProps<T> {
  bodyHeight?: string | number;
  paginationBackground?: string;
  onRow?: any;
  hidePaginationTotal?: boolean;
  hidePageSizeChanger?: boolean;
}
const TableWithPagination = (
  {
    bodyHeight,
    paginationBackground,
    pagination,
    columns,
    dataSource,
    loading,
    hidePaginationTotal,
    hidePageSizeChanger,
    ...props
  }: ITableWithPagination,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const [_pageSize, setPageSize] = useState<number>(
    (pagination && pagination?.pageSize) || 10
  );

  const _dataSource = loading
    ? new Array(_pageSize).fill(null).map((_, index) => ({ key: index }))
    : dataSource;

  const _columns = loading
    ? columns?.map((c) => {
      return {
        ...c,
        render: () => (
          <Skeleton.Input
            size="small"
            active
            block
          // style={{ width: Math.floor(Math.random() * 30) + 70 + '%' }}
          />
        ),
      };
    })
    : columns;

  useEffect(() => {
    if (pagination && pagination.pageSize !== undefined) {
      setPageSize(pagination?.pageSize || 10);
    }
  }, [pagination]);

  return (
    <TableWrapper
      ref={ref}
      paginationBackground={paginationBackground}
      $bodyHeight={bodyHeight}
    >
      <Table
        loading={loading}
        columns={_columns}
        dataSource={_dataSource}
        pagination={{
          total: (pagination && pagination?.total) || dataSource?.length,
          showSizeChanger: !hidePageSizeChanger,
          pageSize: _pageSize,
          showTotal: hidePaginationTotal
            ? undefined
            : (total, range) => `${range[0]}- ${range[1]} trong số ${total}`,
          onShowSizeChange: (_, size) => setPageSize(size),
          ...pagination,
        }}
        {...props}
      />
    </TableWrapper>
  );
};

export default forwardRef<HTMLDivElement, ITableWithPagination>(
  TableWithPagination
);
