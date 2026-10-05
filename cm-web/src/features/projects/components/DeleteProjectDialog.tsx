import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { errorMessages } from '@/api/http'
import { useDeleteProject } from '../queries'
import type { Project } from '../types'

type DeleteProjectDialogProps = {
  project: Project | null
  onClose: () => void
  onDeleted?: () => void
}

export function DeleteProjectDialog({ project, onClose, onDeleted }: DeleteProjectDialogProps) {
  const deleteMutation = useDeleteProject()

  function handleDelete() {
    if (!project) return
    deleteMutation.mutate(project.id, {
      onSuccess: () => {
        toast.success(`Deleted “${project.projectName}”`)
        onClose()
        onDeleted?.()
      },
      onError: (error) => {
        toast.error(errorMessages(error)[0])
      },
    })
  }

  return (
    <AlertDialog
      open={project !== null}
      onOpenChange={(open) => {
        if (!open && !deleteMutation.isPending) onClose()
      }}
    >
      <AlertDialogContent>
        <AlertDialogTitle>Delete this project?</AlertDialogTitle>
        <AlertDialogDescription>
          “{project?.projectName}” will be removed permanently. This can’t be undone.
        </AlertDialogDescription>
        <div className="mt-6 flex justify-end gap-3">
          <AlertDialogCancel asChild>
            <Button variant="secondary" disabled={deleteMutation.isPending}>
              Keep project
            </Button>
          </AlertDialogCancel>
          {/* Not AlertDialogAction: that closes the dialog before the request finishes. */}
          <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting…' : 'Delete project'}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
