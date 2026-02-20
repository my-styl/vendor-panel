import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { DateCell } from "../../../components/table/table-cells/common/date-cell"
import { TextCell } from "../../../components/table/table-cells/common/text-cell"
import { Brand } from "../../api/brands"

const columnHelper = createColumnHelper<Brand>()

export const useBrandTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => t("fields.name"),
        cell: ({ getValue }) => <TextCell text={getValue()} />,
      }),
      columnHelper.accessor("handle", {
        header: () => t("fields.handle"),
        cell: ({ getValue }) => <TextCell text={getValue()} />,
      }),
      columnHelper.accessor("created_at", {
        header: () => t("fields.createdAt"),
        cell: ({ getValue }) => <DateCell date={getValue()} />,
      }),
      columnHelper.accessor("updated_at", {
        header: () => t("fields.updatedAt"),
        cell: ({ getValue }) => <DateCell date={getValue()} />,
      }),
    ],
    [t]
  )
}
