"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "~/components/ui/button"
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
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { useGetUser } from "~/hooks/api/auth"
import { useCreateTemplate } from "~/hooks/api/template"

type CreateTemplateValues = {
  title: string
  description: string
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { user } = useUser()
  const { getUserData } = useGetUser(user?.id)
  const { createTemplateAsync, isPending } = useCreateTemplate()
  const form = useForm<CreateTemplateValues>({
    defaultValues: {
      title: "",
      description: "",
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
        </div>
      </div>
    </header>
  )
}
