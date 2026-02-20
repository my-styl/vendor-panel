import { UIMatch } from "react-router-dom"
import { useBrand, BrandResponse } from "../../../hooks/api"

type BrandDetailBreadcrumbProps = UIMatch<BrandResponse>

export const BrandDetailBreadcrumb = (props: BrandDetailBreadcrumbProps) => {
  const { id } = props.params || {}

  const { brand } = useBrand(id!, undefined, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!brand) {
    return null
  }

  return <span>{brand.name}</span>
}
