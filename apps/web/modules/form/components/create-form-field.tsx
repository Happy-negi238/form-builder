"use client"

import { useState, type FormEvent } from "react"
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
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { useCreatFormField } from "~/hooks/api/form"

type CreateFormFieldProps = {
  formId: string
}

const CreateFormField = ({ formId }: CreateFormFieldProps) => {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState("")
  const [type, setType] = useState<"TEXT" | "EMAIL" | "PASSWORD" | "NUMBER" | "YES_NO">("TEXT")
  const [placeholder, setPlaceholder] = useState("")
  const [description, setDescription] = useState("")
  const [isRequired, setIsRequired] = useState(false)
  const { creatFormFieldAsync, isError, error, isPending } = useCreatFormField()

  const resetForm = () => {
    setLabel("")
    setType("TEXT")
    setPlaceholder("")
    setDescription("")
    setIsRequired(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await creatFormFieldAsync({
      formId,
      label,
      type,
      placeholder: placeholder || undefined,
      description: description || undefined,
      isRequired,
    })
    resetForm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add field
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add form field</DialogTitle>
          <DialogDescription>Add a field to this form.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="field-label">Label</Label>
            <Input
              id="field-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Enter field name"
              maxLength={70}
              minLength={2}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-type">Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as typeof type)} disabled={isPending}>
              <SelectTrigger id="field-type" className="w-full">
                <SelectValue placeholder="Select a field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Text</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="PASSWORD">Password</SelectItem>
                <SelectItem value="NUMBER">Number</SelectItem>
                <SelectItem value="YES_NO">Yes / No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-placeholder">Placeholder</Label>
            <Input
              id="field-placeholder"
              value={placeholder}
              onChange={(event) => setPlaceholder(event.target.value)}
              placeholder="Enter field placeholder"
              maxLength={70}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-description">Description</Label>
            <Textarea
              id="field-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explain what this field is for"
              maxLength={100}
              disabled={isPending}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="field-required"
              checked={isRequired}
              onCheckedChange={(checked) => setIsRequired(checked === true)}
              disabled={isPending}
            />
            <Label htmlFor="field-required">Required field</Label>
          </div>

          {isError && (
            <p className="text-destructive text-sm" role="alert">
              {error?.message ?? "Could not create the form field."}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add field"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFormField
