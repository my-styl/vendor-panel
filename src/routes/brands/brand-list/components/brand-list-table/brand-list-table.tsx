import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { _DataTable } from "../../../../../components/table/data-table"
import { useBrands } from "../../../../../hooks/api"
import { useBrandTableColumns } from "../../../../../hooks/table/columns"
import { useBrandTableQuery } from "../../../../../hooks/table/query"
import { useDataTable } from "../../../../../hooks/use-data-table"

const PAGE_SIZE = 20

export const BrandListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useBrandTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { brands, count, isPending, isError, error } = useBrands(searchParams, {
    placeholderData: keepPreviousData,
  })

  const columns = useColumns()

  const { table } = useDataTable({
    data: brands,
    count,
    columns,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y px-0 py-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("brands.domain")}</Heading>
        <Button variant="secondary" size="small" asChild>
          <Link to="create">{t("brands.create.title")}</Link>
        </Button>
      </div>
      <_DataTable
        table={table}
        queryObject={raw}
        isLoading={isPending}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        navigateTo={(row) => row.original.id}
        pagination
      />
    </Container>
  )
}

const useColumns = () => {
  const base = useBrandTableColumns()

  return useMemo(() => [...base], [base])
}

