import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { errorMessages, isNotFound } from '@/api/http'
import { Button } from '@/components/ui/button'
import { ErrorPanel } from '@/components/ui/error-panel'
import { NotFound } from '@/app/NotFound'
import { getClientName } from '../clients'
import { DeleteProjectDialog } from '../components/DeleteProjectDialog'
import { FormPageLayout } from '../components/FormPageLayout'
import { ProjectForm } from '../components/ProjectForm'
import { useProject, useUpdateProject } from '../queries'
import { toFormValues, toProjectInput, type ProjectFormValues } from '../schema'

export default function ProjectEditPage() {
  const { id: rawId } = useParams()
  const id = Number(rawId)

  if (!Number.isInteger(id) || id <= 0) {
    return <NotFound title="Project not found" message="That project link isn’t valid." />
  }
  // Keyed so switching projects resets all form and mutation state.
  return <EditProject key={id} id={id} />
}

function EditProject({ id }: { id: number }) {
  const navigate = useNavigate()
  const { data: project, error, isPending, refetch } = useProject(id)
  const updateMutation = useUpdateProject(id)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (isPending) {
    return (
      <FormPageLayout title="Edit project">
        <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading project">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-md bg-line" />
          ))}
        </div>
      </FormPageLayout>
    )
  }

  if (isNotFound(error)) {
    return <NotFound title="Project not found" message="It may have been deleted." />
  }

  if (error) {
    return (
      <FormPageLayout title="Edit project">
        <ErrorPanel
          title="This project couldn’t be loaded."
          messages={errorMessages(error)}
          action={
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      </FormPageLayout>
    )
  }

  function handleSubmit(values: ProjectFormValues) {
    updateMutation.mutate(toProjectInput(values), {
      onSuccess: (updated) => {
        toast.success(`Saved changes to “${updated.projectName}”`)
        navigate('/projects')
      },
    })
  }

  const serverErrors = errorMessages(updateMutation.error)

  return (
    <FormPageLayout
      title={project.projectName}
      description={`Project for ${getClientName(project.clientId)}`}
      aside={
        <Button variant="secondary" onClick={() => setConfirmDelete(true)} className="hover:text-danger">
          <Trash2 aria-hidden="true" />
          Delete
        </Button>
      }
    >
      <ProjectForm
        defaultValues={toFormValues(project)}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        isPending={updateMutation.isPending}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
      />
      <DeleteProjectDialog
        project={confirmDelete ? project : null}
        onClose={() => setConfirmDelete(false)}
        onDeleted={() => navigate('/projects')}
      />
    </FormPageLayout>
  )
}
