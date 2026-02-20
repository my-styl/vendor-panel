import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { fetchQuery } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

export type Brand = {
  id: string
  name: string
  handle: string
  description?: string | null
  logo?: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export type BrandListResponse = {
  brands: Brand[]
  count: number
  offset: number
  limit: number
}

export type BrandResponse = { brand: Brand }

export type CreateBrandPayload = {
  name: string
  handle: string
  description?: string
  logo?: string
}

export type UpdateBrandPayload = {
  name?: string
  handle?: string
  description?: string
  logo?: string
}

export type BrandListParams = {
  limit?: number
  offset?: number
  order?: string
  q?: string
  created_at?: Record<string, unknown>
  updated_at?: Record<string, unknown>
}

const BRANDS_QUERY_KEY = "brands" as const
export const brandsQueryKeys = queryKeysFactory(BRANDS_QUERY_KEY)

export const useBrand = (
  id: string,
  query?: Record<string, string | number>,
  options?: Omit<
    UseQueryOptions<BrandResponse, FetchError, BrandResponse, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: brandsQueryKeys.detail(id, query),
    queryFn: async () =>
      fetchQuery(`/vendor/brands/${id}`, {
        method: "GET",
        query,
      }),
    ...options,
  })

  return { ...data, ...rest }
}

export const useBrands = (
  query?: BrandListParams,
  options?: Omit<
    UseQueryOptions<BrandListResponse, FetchError, BrandListResponse, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () =>
      fetchQuery("/vendor/brands", {
        method: "GET",
        query: query as { [key: string]: string | number },
      }),
    queryKey: brandsQueryKeys.list(query),
    ...options,
  })

  const brands: Brand[] = data?.brands || []
  const count = data?.count || brands.length

  return { ...data, brands, count, ...rest }
}

export const useCreateBrand = (
  options?: UseMutationOptions<BrandResponse, FetchError, CreateBrandPayload>
) => {
  return useMutation({
    mutationFn: (payload) =>
      fetchQuery("/vendor/brands", {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: brandsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateBrand = (
  id: string,
  options?: UseMutationOptions<BrandResponse, FetchError, UpdateBrandPayload>
) => {
  return useMutation({
    mutationFn: (payload) =>
      fetchQuery(`/vendor/brands/${id}`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: brandsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: brandsQueryKeys.detail(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteBrand = (
  id: string,
  options?: UseMutationOptions<void, FetchError, void>
) => {
  return useMutation({
    mutationFn: () =>
      fetchQuery(`/vendor/brands/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: brandsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: brandsQueryKeys.detail(id),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
