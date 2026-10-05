import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { errorMessages } from '@/api/http'
import { ProjectForm } from '../components/ProjectForm'
import { FormPageLayout } from '../components/FormPageLayout'
import { useCreateProject } from '../queries'
import { emptyProjectForm, toProjectInput, type ProjectFormValues } from '../schema'

export default function ProjectCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateProject()

  function handleSubmit(values: ProjectFormValues) {
    createMutation.mutate(toProjectInput(values), {
      onSuccess: (project) => {
        toast.success(`Created “${project.projectName}”`)
        navigate('/projects')
      },
    })
  }

  const serverErrors = errorMessages(createMutation.error)

  return (
    <FormPageLayout title="New project" description="Add a client project to the tracker.">
      <ProjectForm
        defaultValues={emptyProjectForm}
        submitLabel="Create project"
        pendingLabel="Creating…"
        isPending={createMutation.isPending}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
      />
    </FormPageLayout>
  )
}
