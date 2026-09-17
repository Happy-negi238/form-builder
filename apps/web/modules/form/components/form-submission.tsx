"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Spinner } from "~/components/ui/spinner"
import { useCheckFormPassword, useFormSubmission, useGetFromById } from "~/hooks/api/form"

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
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(true)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordToVerify, setPasswordToVerify] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const form = useForm<SubmissionValues>({ defaultValues: {} })
  const { formSubmissionAsync, isPending: isFormSubmissionPending, isError: isFormSubmissionError } = useFormSubmission()

  const isPrivateForm = useMemo(() => Boolean(getFromByIdData?.isPrivate), [getFromByIdData])
  const { getCheckFormPassword, isPending: isPasswordChecking, isError: isPasswordCheckError } = useCheckFormPassword(
    formId,
    passwordToVerify,
    isPasswordDialogOpen && Boolean(passwordToVerify),
  )

  if (isPending) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-zinc-950 text-zinc-400">
        <Spinner />
        <div className="text-sm tracking-wide">Form is rendering...</div>
      </main>
    )
  }

  if (isError || !getFromByIdData) {
    return <main className="grid min-h-screen place-items-center bg-zinc-950 p-6 text-zinc-400">This form is unavailable.</main>
  }

  const { fields, title, description, isPrivate, status, expireAt } = getFromByIdData

  const isPasswordMatch = getCheckFormPassword?.data === "Password is matched"

  if (isPrivate && !isPasswordMatch) {
    const handleVerifyPassword = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const trimmedPassword = passwordInput.trim()

      if (!trimmedPassword) {
        setPasswordError("Password is required.")
        return
      }

      setPasswordError("")
      setPasswordToVerify(trimmedPassword)
      setIsPasswordDialogOpen(true)
    }

    return (
      <Dialog open={isPasswordDialogOpen} onOpenChange={(open) => open && setIsPasswordDialogOpen(true)}>
        <DialogContent
          className="max-w-md border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl shadow-black/50"
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          showCloseButton={false}
        >
          <DialogHeader className="gap-3">
            <div className="flex size-10 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10 text-red-300">
              <span className="text-lg">&#8226;</span>
            </div>
            <DialogTitle className="text-2xl tracking-tight">This form is private</DialogTitle>
            <DialogDescription className="text-zinc-400">Enter the password to access this form.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerifyPassword} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="form-password" className="text-sm font-medium text-zinc-200">
                Password
              </label>
              <Input
                id="form-password"
                type="password"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                placeholder="Enter password"
                className="h-9 border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:border-zinc-400 focus-visible:ring-zinc-400/30"
              />
            </div>

            {(isPasswordCheckError || passwordError) && (
              <p className="text-sm text-red-400">
                {passwordError || "The password is incorrect. Please try again."}
              </p>
            )}

            <DialogFooter>
              <Button type="submit" className="h-11 w-full bg-zinc-300 font-semibold text-zinc-950 hover:bg-zinc-200">
                {"Submit password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  const onSubmit = async (formValues: SubmissionValues) => {
    const submissionValues: Array<{ formFieldId: string; value: string }> = fields.map(({ id, labelKey }) => ({
      formFieldId: id,
      value: formValues[labelKey] ?? "",
    }))

    const { formSubmissionId } = await formSubmissionAsync({ formId, values: submissionValues })
    console.log("formSubmissionId: ", formSubmissionId)
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen px-4 py-10 text-zinc-950">
      <div className="mx-auto max-w-xl">
        <Card className="overflow-hidden bg-accent/40 shadow-2xl shadow-black/40">
        <CardHeader className="text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="max-w-xl text-3xl font-semibold tracking-tight text-white capitalize">{title}</CardTitle>
              {description && <CardDescription className="mt-1 max-w-xl text-sm leading-5 text-zinc-400">{description}</CardDescription>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-zinc-900 text-xs text-zinc-100 hover:bg-zinc-800" variant="outline">
                {status ?? "Publish"}
              </Badge>
              {isPrivate && <Badge className="border-rose-300 bg-rose-300/10 text-xs text-rose-300" variant="outline">Private</Badge>}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-zinc-800 pt-4 text-sm text-zinc-400">
            <span>Closes: </span>
            <span className="text-zinc-200">{expireAt ? new Date(expireAt).toLocaleString() : "No expiry"}</span>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-6 text-white sm:px-8 sm:py-8">
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-green-100 text-xl text-green-700">&#10003;</div>
              <p className="text-xl font-semibold text-white">Thanks for your response.</p>
              <p className="mt-2 text-zinc-400">Your submission has been recorded.</p>
            </div>
          ) : fields.length === 0 ? (
            <p className="py-8 text-center text-zinc-400">This form has no questions yet.</p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {fields.map((field) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.labelKey}
                    rules={field.isRequired ? { required: `${field.label} is required` } : undefined}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-white">
                          {field.label}
                          {field.isRequired && <span className="text-rose-400"> *</span>}
                        </FormLabel>
                        {field.description && <FormDescription className="text-sm leading-5 text-zinc-400">{field.description}</FormDescription>}
                        <FormControl>
                          {field.type === "YES_NO" ? (
                            <select {...inputField} className="flex h-10 w-full rounded-md border border-zinc-700 px-3 py-2 
                            text-sm text-white shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 
                            focus:ring-zinc-400/20 disabled:cursor-not-allowed disabled:opacity-50">
                              <option value="">Choose an answer</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          ) : (
                            <Input
                              {...inputField}
                              type={inputTypeByFieldType[field.type as keyof typeof inputTypeByFieldType] ?? "text"}
                              placeholder={field.placeholder ?? undefined}
                              className="h-9 border-zinc-700 text-sm text-white placeholder:text-zinc-500 focus-visible:border-zinc-400 focus-visible:ring-zinc-400/20"
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {isFormSubmissionError && <p className="text-sm text-red-600">Unable to submit your response. Please try again.</p>}
                <Button type="submit" className="h-9 w-full bg-white px-4 text-sm font-medium text-zinc-950 hover:bg-zinc-200 sm:w-auto" disabled={isFormSubmissionPending}>
                  {isFormSubmissionPending ? "Submitting..." : "Submit response"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      </div>
    </main>
  )
}

export default FormSubmission