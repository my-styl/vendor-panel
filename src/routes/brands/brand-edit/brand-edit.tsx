import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useBrand } from "../../../hooks/api"
import { BrandEditForm } from "./components/brand-edit-form"

export const BrandEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { brand, isPending, isError, error } = useBrand(id!)

  const ready = !isPending && !!brand

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("brands.edit.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("brands.edit.subtitle")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {ready && <BrandEditForm brand={brand} />}
    </RouteDrawer>
  )
}
