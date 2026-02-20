import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Container, Heading, Text, Button } from "@medusajs/ui"
import { PencilSquare, Trash } from "@medusajs/icons"

import { Brand } from "../../../../../hooks/api/brands"
import { useDeleteBrandAction } from "../../../common/hooks/use-delete-brand-action"

type BrandGeneralSectionProps = {
  brand: Brand
}

export const BrandGeneralSection = ({ brand }: BrandGeneralSectionProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteBrandAction({ brand })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{brand.name}</Heading>
        <div className="flex items-center gap-x-2">
          <Button size="small" variant="secondary" asChild>
            <Link to="edit">
              <PencilSquare className="mr-1" />
              {t("actions.edit")}
            </Link>
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={handleDelete}
          >
            <Trash className="mr-1" />
            {t("actions.delete")}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 px-6 py-4">
        <div>
          <Text size="small" weight="plus" className="text-ui-fg-subtle">
            {t("brands.fields.handle")}
          </Text>
          <Text size="small">{brand.handle}</Text>
        </div>
        {brand.logo && (
          <div>
            <Text size="small" weight="plus" className="text-ui-fg-subtle">
              {t("brands.fields.logo")}
            </Text>
            <img
              src={brand.logo}
              alt={brand.name}
              className="mt-1 h-10 w-auto object-contain"
            />
          </div>
        )}
      </div>
      {brand.description && (
        <div className="px-6 py-4">
          <Text size="small" weight="plus" className="text-ui-fg-subtle">
            {t("fields.description")}
          </Text>
          <Text size="small" className="mt-1">
            {brand.description}
          </Text>
        </div>
      )}
    </Container>
  )
}
