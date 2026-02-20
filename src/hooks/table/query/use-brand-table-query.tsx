import { useQueryParams } from "../../use-query-params"

type UseBrandTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useBrandTableQuery = ({
  prefix,
  pageSize = 20,
}: UseBrandTableQueryProps) => {
  const queryObject = useQueryParams(["offset"], prefix)

  const { offset } = queryObject
  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
