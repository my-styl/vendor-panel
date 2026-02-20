import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useBrand, BrandResponse } from "../../../hooks/api"
import { BrandGeneralSection } from "./components/brand-general-section"
import { brandLoader } from "./loader"

export const BrandDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<ReturnType<typeof brandLoader>>

  const { brand, isPending, isError, error } = useBrand(id!, undefined, {
    initialData: initialData as BrandResponse,
  })

  if (isPending || !brand) {
    return <SingleColumnPageSkeleton showJSON sections={2} />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      data={brand}
      hasOutlet
      widgets={{ before: [], after: [] }}
    >
      <BrandGeneralSection brand={brand} />
    </SingleColumnPage>
  )
}
