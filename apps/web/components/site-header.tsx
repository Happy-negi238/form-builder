"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { Textarea } from "~/components/ui/textarea"
import { useGetUser } from "~/hooks/api/auth"
import { useCreateTemplate, useCreateTemplateField } from "~/hooks/api/template"
import { toast } from "sonner"

type CreateTemplateValues = {
  title: string
  description: string
}

const createTemplateFieldSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(70),
  description: z.string().trim().max(100).optional(),
  type: z.enum(["TEXT", "EMAIL", "PASSWORD", "NUMBER", "YES_NO"]),
  isRequired: z.boolean().default(false),
  templateId: z.string().min(1, "Template id is required"),
})

type CreateTemplateFieldInput = z.input<typeof createTemplateFieldSchema>
type CreateTemplateFieldValues = z.output<typeof createTemplateFieldSchema>

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [fieldOpen, setFieldOpen] = useState(false)
  const [fieldSuccessMessage, setFieldSuccessMessage] = useState("")
  const { user } = useUser()
  const { getUserData } = useGetUser(user?.id)
  const { createTemplateAsync, isPending } = useCreateTemplate()
  const { createTemplateFieldAsync, isPending: isFieldPending } = useCreateTemplateField()
  const form = useForm<CreateTemplateValues>({
    defaultValues: {
      title: "",
      description: "",
    },
  })
  const fieldForm = useForm<
    CreateTemplateFieldInput,
    undefined,
    CreateTemplateFieldValues
  >({
    resolver: zodResolver(createTemplateFieldSchema),
    defaultValues: {
      label: "",
      description: "",
      type: "TEXT",
      isRequired: false,
      templateId: "",
    },
  })

  const isAdmin = getUserData?.[0]?.role === "ADMIN"

  const onSubmit = async (values: CreateTemplateValues) => {
    const result = await createTemplateAsync({
      title: values.title.trim(),
      description: values.description.trim() || undefined,
    })

    console.log("Template created:", result)
    form.reset()
    setOpen(false)
    fieldForm.reset({
      label: "",
      description: "",
      type: "TEXT",
      isRequired: false,
      templateId: result.id,
    })
    setFieldSuccessMessage("")
    setFieldOpen(true)
  }

  const onTemplateFieldSubmit = async (values: CreateTemplateFieldValues) => {
    const payload = {
      ...values,
      label: values.label.trim(),
      description: values.description?.trim() || undefined,
    }

    const result = await createTemplateFieldAsync(payload)
    fieldForm.reset({
      label: "",
      description: "",
      type: "TEXT",
      isRequired: false,
      templateId: values.templateId,
    })
    toast.success("Template field created successfully")
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus />
                  Create template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create template</DialogTitle>
                  <DialogDescription>
                    Add the details for the new template.
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      rules={{ required: "Title is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Customer feedback template"
                              maxLength={70}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Optional description"
                              maxLength={200}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create template"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}

          {isAdmin && (
            <Dialog open={fieldOpen} onOpenChange={setFieldOpen}>
              <DialogContent
                onEscapeKeyDown={(event) => event.preventDefault()}
                onPointerDownOutside={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Add template field</DialogTitle>
                  <DialogDescription>
                    Add a field to the template you just created.
                  </DialogDescription>
                </DialogHeader>

                {fieldSuccessMessage && (
                  <p className="text-sm text-green-600" role="status">
                    {fieldSuccessMessage}
                  </p>
                )}

                <Form {...fieldForm}>
                  <form
                    onSubmit={fieldForm.handleSubmit(onTemplateFieldSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={fieldForm.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Customer email"
                              maxLength={70}
                              disabled={isFieldPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={fieldForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Optional field description"
                              maxLength={100}
                              disabled={isFieldPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={fieldForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isFieldPending}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a field type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="TEXT">Text</SelectItem>
                              <SelectItem value="EMAIL">Email</SelectItem>
                              <SelectItem value="PASSWORD">Password</SelectItem>
                              <SelectItem value="NUMBER">Number</SelectItem>
                              <SelectItem value="YES_NO">Yes / No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={fieldForm.control}
                      name="isRequired"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isFieldPending}
                            />
                          </FormControl>
                          <FormLabel className="mt-0!">Required field</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" disabled={isFieldPending}>
                        {isFieldPending ? "Adding..." : "Add field"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  )
}
