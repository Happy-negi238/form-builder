"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"

type DeleteFieldDialogProps = {
  fieldId: string | null | undefined
  fieldLabel: string
  onConfirm: () => void | Promise<void>
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteFieldDialog({
  fieldId,
  fieldLabel,
  onConfirm,
  open,
  onOpenChange,
}: DeleteFieldDialogProps) {
  const dialogIdText = fieldId ? "" : "Field ID: unsaved"
  const buttonLabel = fieldId ? `Delete field` : "Delete unsaved field"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" className="w-full" title={fieldId ? `Delete field` : "Delete unsaved field"} aria-label={fieldId ? `Delete field ${fieldId}` : "Delete unsaved field"}>
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this field?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove <span className="font-medium text-foreground">{fieldLabel}</span> from the form builder.
            <br />
            {dialogIdText}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () => await onConfirm()}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
