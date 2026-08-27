"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
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
import { Spinner } from "~/components/ui/spinner"
import { useFormSubmission, useGetFromById } from "~/hooks/api/form"

type FormSubmissionProps = {
  formId: string
}

type SubmissionValues = Record<string, string>

const inputTypeByFieldType = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
  NUMBER: "number",
} as const

const FormSubmission = ({ formId }: FormSubmissionProps) => {
  const { getFromByIdData, isPending, isError } = useGetFromById(formId)
  const [submitted, setSubmitted] = useState(false)
  const form = useForm<SubmissionValues>({ defaultValues: {} })
  const { formSubmissionAsync, isPending: isFormSubmissionPending, isError: isFormSubmissionError } = useFormSubmission()

  if (isPending) {
    return <main className="flex flex-col h-screen items-center justify-center text-muted-foreground">
      <Spinner />
      <div className="">
        From is rendering..
      </div>
    </main>
  }

  if (isError || !getFromByIdData) {
    return <main className="grid min-h-screen place-items-center p-6 text-muted-foreground">This form is unavailable.</main>
  }

  const { fields, title, description } = getFromByIdData

  const onSubmit = async (formValues: SubmissionValues) => {
    const submissionValues: Array<{ formFieldId: string; value: string }> = fields.map(({ id, labelKey }) => ({
      formFieldId: id,
      value: formValues[labelKey] ?? "",
    }))

    console.log("Form submission", {
      formId,
      values: submissionValues,
    })
    const { formSubmissionId } = await formSubmissionAsync({ formId, values: submissionValues })
    console.log("formSubmissionId: ", formSubmissionId);
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-12 sm:px-6">
      <Card className="mx-auto max-w-2xl border-border/70 shadow-lg">
        <CardHeader className="border-b bg-card px-6 py-8 sm:px-10">
          <CardTitle className="text-3xl tracking-tight">{title}</CardTitle>
          {description && <CardDescription className="max-w-xl text-base">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="px-6 py-8 sm:px-10">
          {submitted ? (
            <div className="py-8 text-center">
              <p className="text-xl font-semibold">Thanks for your response.</p>
              <p className="mt-2 text-muted-foreground">Your submission has been recorded.</p>
            </div>
          ) : fields.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">This form has no questions yet.</p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {fields.map((field) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.labelKey}
                    rules={field.isRequired ? { required: `${field.label} is required` } : undefined}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <FormLabel>
                          {field.label}
                          {field.isRequired && <span className="text-destructive "> *</span>}
                        </FormLabel>
                        <FormLabel className="text-xs font-normal">
                          {field.description && <FormDescription>{field.description}</FormDescription>}
                        </FormLabel>
                        <FormControl>
                          {field.type === "YES_NO" ? (
                            <select {...inputField} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">
                              <option value="">Choose an answer</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          ) : (
                            <Input
                              {...inputField}
                              type={inputTypeByFieldType[field.type as keyof typeof inputTypeByFieldType] ?? "text"}
                              placeholder={field.placeholder ?? undefined}
                            />
                          )
                          }
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {isFormSubmissionError && <p className="text-sm text-destructive">Unable to submit your response. Please try again.</p>}
                <Button type="submit" className="w-full sm:w-auto" disabled={isFormSubmissionPending}>
                  {isFormSubmissionPending ? "Submitting..." : "Submit response"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default FormSubmission