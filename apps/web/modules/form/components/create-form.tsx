"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { useCreateForm } from "~/hooks/api/form"

type CreateFormValues = {
  title: string
  description: string
  expireAt: string
  status: "publish" | "unpublish" | "closed"
  responseLimit: string
  isPrivate: boolean
  password: string
}

const CreateForm = () => {
  const [open, setOpen] = useState(false)
  const { createFormAsync, isError, error, isPending } = useCreateForm()
  const form = useForm<CreateFormValues>({
    defaultValues: {
      title: "",
      description: "",
      expireAt: "",
      status: "publish",
      responseLimit: "",
      isPrivate: false,
      password: "",
    },
  })

  const isPrivate = form.watch("isPrivate")

  const resetForm = () => {
    form.reset()
  }

  const onSubmit = async (values: CreateFormValues) => {
    if (values.isPrivate && !values.password.trim()) {
      form.setError("password", {
        type: "manual",
        message: "Password is required for private forms.",
      })
      return
    }

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      expireAt: values.expireAt ? new Date(values.expireAt).toISOString() : null,
      status: values.status,
      responseLimit: values.responseLimit ? Number(values.responseLimit) : null,
      isPrivate: values.isPrivate,
      password: values.isPrivate ? values.password : undefined,
    }

    await createFormAsync(payload)
    resetForm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="default" size="sm">
          <Plus />
          Create form
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <DialogDescription>
            Add the basic details for your new form.
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
                      placeholder="Customer feedback"
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
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell people what this form is for"
                      maxLength={200}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="expireAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expire at</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isPending}
                      >
                        <option value="publish">Publish</option>
                        <option value="unpublish">Unpublish</option>
                        <option value="closed">Closed</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="responseLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response limit</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      placeholder="Optional"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>Leave empty for unlimited responses.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Private form</FormLabel>
                    <FormDescription>Require a password to access the form.</FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {isPrivate && (
              <FormField
                control={form.control}
                name="password"
                rules={{
                  validate: (value) => {
                    if (!value?.trim() && isPrivate) {
                      return "Password is required for private forms."
                    }
                    return true
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter a password"
                        autoComplete="new-password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isError && (
              <p className="text-destructive text-sm" role="alert">
                {error?.message ?? "Could not create the form."}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm()
                  setOpen(false)
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create form"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateForm
