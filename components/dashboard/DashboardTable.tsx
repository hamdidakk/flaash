import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export type DashboardTableAlign = "left" | "center" | "right"

export interface DashboardTableColumn<T> {
  key: string
  header: ReactNode
  align?: DashboardTableAlign
  width?: string | number
  className?: string
  headerClassName?: string
  render?: (row: T, index: number) => ReactNode
}

export interface DashboardTableEmptyState {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export interface DashboardTableProps<T> {
  columns: Array<DashboardTableColumn<T>>
  rows: T[]
  isLoading?: boolean
  loadingRows?: number
  dense?: boolean
  getRowKey?: (row: T, index: number) => string | number
  rowClassName?: (row: T, index: number) => string
  className?: string
  emptyState?: DashboardTableEmptyState
}

const alignMap: Record<DashboardTableAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

export function DashboardTable<T>({
  columns,
  rows,
  isLoading = false,
  loadingRows = 4,
  dense = false,
  getRowKey,
  rowClassName,
  className,
  emptyState,
}: DashboardTableProps<T>) {
  const paddingClass = dense ? "dashboard-table__cell--dense" : "dashboard-table__cell"

  return (
    <div className={cn("dashboard-table-wrapper", className)}>
      <table className="dashboard-table">
        <thead>
          <tr className="dashboard-table__head-row">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  paddingClass,
                  alignMap[column.align ?? "left"],
                  column.headerClassName,
                )}
                style={column.width ? { width: column.width } : undefined}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="dashboard-table__body">
          {isLoading
            ? Array.from({ length: loadingRows }).map((_, idx) => (
                <tr key={`loading-${idx}`}>
                  <td colSpan={columns.length} className={cn(paddingClass)}>
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))
            : rows.length === 0
              ? (
                  <tr>
                    <td colSpan={columns.length} className={cn(paddingClass, "dashboard-table__empty")}>
                      <div className="dashboard-table__empty-inner">
                        {emptyState?.icon}
                        <p className="dashboard-table__empty-title">
                          {emptyState?.title ?? "Aucune donnée pour le moment."}
                        </p>
                        {emptyState?.description ? (
                          <p className="dashboard-table__empty-description">{emptyState.description}</p>
                        ) : null}
                        {emptyState?.action}
                      </div>
                    </td>
                  </tr>
                )
              : rows.map((row, index) => (
                  <tr
                    key={getRowKey ? getRowKey(row, index) : index}
                    className={cn("dashboard-table__row", rowClassName?.(row, index))}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(paddingClass, alignMap[column.align ?? "left"], column.className)}
                        style={column.width ? { width: column.width } : undefined}
                      >
                        {column.render ? column.render(row, index) : (row as Record<string, unknown>)[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
        </tbody>
      </table>
    </div>
  )
}

