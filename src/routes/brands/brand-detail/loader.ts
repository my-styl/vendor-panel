import { LoaderFunctionArgs } from "react-router-dom"

import { brandsQueryKeys } from "../../../hooks/api"
import { fetchQuery } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const brandDetailQuery = (id: string) => ({
  queryKey: brandsQueryKeys.detail(id),
  queryFn: async () =>
    fetchQuery(`/vendor/brands/${id}`, {
      method: "GET",
    }),
})

export const brandLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id!
  return queryClient.ensureQueryData(brandDetailQuery(id))
}
