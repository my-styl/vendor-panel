import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, Textarea, toast } from "@medusajs/ui"
import { useCallback } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import {
  FileType,
  FileUpload,
} from "../../../../../components/common/file-upload"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateBrand } from "../../../../../hooks/api"
import { uploadFilesQuery } from "../../../../../lib/client"
import { MediaSchema } from "../../../../products/product-create/constants"

const BrandCreateSchema = z.object({
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

type BrandCreateFormValues = z.infer<typeof BrandCreateSchema>

export const BrandCreateForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<BrandCreateFormValues>({
    defaultValues: {
      name: "",
      handle: "",
      description: "",
      media: [],
    },
    resolver: zodResolver(BrandCreateSchema),
  })

  const { fields } = useFieldArray({
    name: "media",
    control: form.control,
    keyName: "field_id",
  })

  const { mutateAsync, isPending } = useCreateBrand()

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
    let logoUrl: string | undefined
    if (data.media?.length) {
      try {
        const result = await uploadFilesQuery(data.media)
        logoUrl = result?.files?.[0]?.url
      } catch {
        // keep logoUrl undefined
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
        onSuccess: ({ brand }) => {
          toast.success(
            t("brands.create.successToast", { name: brand.name })
          )
          handleSuccess(`/brands/${brand.id}`)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  // Auto-generate handle from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const currentHandle = form.getValues("handle")
    // Only auto-fill if handle is still empty or was auto-generated
    if (!currentHandle || currentHandle === slugify(form.getValues("name"))) {
      form.setValue("handle", slugify(name), { shouldValidate: false })
    }
  }

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        className="flex size-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-1 justify-center overflow-auto px-6 py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div className="flex flex-col gap-y-1">
              <RouteFocusModal.Title asChild>
                <Heading>{t("brands.create.header")}</Heading>
              </RouteFocusModal.Title>
              <RouteFocusModal.Description asChild>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("brands.create.subtitle")}
                </Text>
              </RouteFocusModal.Description>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{t("fields.name")}</Form.Label>
                    <Form.Control>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleNameChange(e)
                        }}
                      />
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
                      <Input {...field} placeholder="my-brand" />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
            </div>
            <Form.Field
              control={form.control}
              name="media"
              render={() => (
                <Form.Item>
                  <Form.Label optional>{t("brands.fields.logo")}</Form.Label>
                  <Form.Control>
                    <FileUpload
                      uploadedImage={fields[0]?.url || ""}
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
                    <Textarea
                      {...field}
                      placeholder={t("brands.create.descriptionPlaceholder")}
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary" type="button">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}
