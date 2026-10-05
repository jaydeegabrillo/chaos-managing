import { toast } from 'sonner'
import { errorMessages } from '@/api/http'
import { ProjectForm } from './ProjectForm'
import { ProjectDrawer } from './ProjectDrawer'
import { useCreateProject } from '../queries'
import { emptyProjectForm, toProjectInput, type ProjectFormValues } from '../schema'

type ProjectCreateDialogProps = {
  open: boolean
  onClose: () => void
}

export function ProjectCreateDialog({ open, onClose }: ProjectCreateDialogProps) {
  const createMutation = useCreateProject()

  function handleSubmit(values: ProjectFormValues) {
    createMutation.mutate(toProjectInput(values), {
      onSuccess: (project) => {
        toast.success(`Created “${project.projectName}”`)
        onClose()
      },
    })
  }

  return (
    <ProjectDrawer
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !createMutation.isPending) onClose()
      }}
      title="New project"
      description="Add a client project to the tracker."
    >
      <ProjectForm
        key={String(open)}
        defaultValues={emptyProjectForm}
        submitLabel="Create project"
        pendingLabel="Creating…"
        isPending={createMutation.isPending}
        serverErrors={errorMessages(createMutation.error)}
        onCancel={() => {
          if (!createMutation.isPending) onClose()
        }}
        onSubmit={handleSubmit}
      />
    </ProjectDrawer>
  )
}
