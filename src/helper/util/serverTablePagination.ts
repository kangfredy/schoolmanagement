import type { TablePaginationConfig } from 'antd/es/table/interface'

/** Ant Design Table server paging: row-count hint when the API does not return an exact total. */
export function buildServerTablePagination(
  current: number,
  pageSize: number,
  hasNextPage: boolean,
  pageDataLength: number,
): TablePaginationConfig {
  const rowCountHint = hasNextPage
    ? current * pageSize + 1
    : (current - 1) * pageSize + pageDataLength
  return {
    current,
    pageSize,
    total: rowCountHint,
    showTotal: () => null,
  }
}
