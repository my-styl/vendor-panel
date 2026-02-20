import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Textarea, toast } from "@medusajs/ui"
import { useCallback } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import {
  FileType,
  FileUpload,
} from "../../../../../components/common/file-upload"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { Brand } from "../../../../../hooks/api/brands"
import { useUpdateBrand } from "../../../../../hooks/api"
import { uploadFilesQuery } from "../../../../../lib/client"
import { MediaSchema } from "../../../../products/product-create/constants"

type BrandEditFormProps = {
  brand: Brand
}

const BrandEditSchema = z.object({
  name: z.string().min(1),
  handle: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Handle must be lowercase, URL-safe (e.g. my-brand)"),
  description: z.string().optional(),
  media: z.array(MediaSchema).optional(),
})

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/svg+xml",
]

type BrandEditFormValues = z.infer<typeof BrandEditSchema>

export const BrandEditForm = ({ brand }: BrandEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<BrandEditFormValues>({
    defaultValues: {
      name: brand.name,
      handle: brand.handle,
      description: brand.description || "",
      media: [],
    },
    resolver: zodResolver(BrandEditSchema),
  })

  const { fields } = useFieldArray({
    name: "media",
    control: form.control,
    keyName: "field_id",
  })

  const { mutateAsync, isPending } = useUpdateBrand(brand.id)

  const hasInvalidFiles = useCallback(
    (fileList: FileType[]) => {
      const invalidFile = fileList.find(
        (f) => !SUPPORTED_FORMATS.includes(f.file.type)
      )
      if (invalidFile) {
        form.setError("media", {
          type: "invalid_file",
          message: `Unsupported format: ${invalidFile.file.name}`,
        })
        return true
      }
      return false
    },
    [form]
  )

  const onUploaded = useCallback(
    (files: FileType[]) => {
      form.clearErrors("media")
      if (hasInvalidFiles(files)) return
      form.setValue("media", [{ ...files[0], isThumbnail: false }])
    },
    [form, hasInvalidFiles]
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    let logoUrl: string | undefined = brand.logo || undefined
    if (data.media?.length) {
      try {
        const result = await uploadFilesQuery(data.media)
        logoUrl = result?.files?.[0]?.url ?? logoUrl
      } catch {
        // keep existing logoUrl
      }
    }
    await mutateAsync(
      {
        name: data.name,
        handle: data.handle,
        description: data.description || undefined,
        logo: logoUrl,
      },
      {
        onSuccess: ({ brand: updated }) => {
          toast.success(t("brands.edit.successToast", { name: updated.name }))
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        className="flex size-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-4 overflow-auto">
          <Form.Field
            control={form.control}
            name="name"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>{t("fields.name")}</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="handle"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>{t("brands.fields.handle")}</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="media"
            render={() => (
              <Form.Item>
                <Form.Label optional>{t("brands.fields.logo")}</Form.Label>
                <Form.Control>
                  <FileUpload
                    uploadedImage={fields[0]?.url || brand.logo || ""}
                    multiple={false}
                    label={t("products.media.uploadImagesLabel")}
                    hint={t("products.media.uploadImagesHint")}
                    hasError={!!form.formState.errors.media}
                    formats={SUPPORTED_FORMATS}
                    onUploaded={onUploaded}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="description"
            render={({ field }) => (
              <Form.Item>
                <Form.Label optional>{t("fields.description")}</Form.Label>
                <Form.Control>
                  <Textarea {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small" type="button">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
