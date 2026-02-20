import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { Brand } from "../../../../hooks/api/brands"
import { useDeleteBrand } from "../../../../hooks/api"

type UseDeleteBrandActionProps = {
  brand: Brand
}

export const useDeleteBrandAction = ({ brand }: UseDeleteBrandActionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteBrand(brand.id)

  const handleDelete = async () => {
    const confirmed = await prompt({
      title: t("general.areYouSure"),
      description: t("brands.delete.confirmation", { name: brand.name }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirmed) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("brands.delete.successToast", { name: brand.name }))
        navigate("/brands", { replace: true })
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return handleDelete
}
