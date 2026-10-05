import { useState } from 'react'
import { toast } from 'sonner'
import { errorMessages, isNotFound } from '@/api/http'
import { Button } from '@/components/ui/button'
import { ErrorPanel } from '@/components/ui/error-panel'
import { NotFound } from '@/app/NotFound'
import { getClientName } from '../clients'
import { DeleteProjectDialog } from './DeleteProjectDialog'
import { ProjectDrawer } from './ProjectDrawer'
import { ProjectForm } from './ProjectForm'
import { useProject, useUpdateProject } from '../queries'
import { toFormValues, toProjectInput, type ProjectFormValues } from '../schema'
import type { Project } from '../types'

type ProjectEditDialogProps = {
  project: Project | null
  open: boolean
  onClose: () => void
}

export default function ProjectEditDialog({ project, open, onClose }: ProjectEditDialogProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const projectId = project?.id ?? 0
  const { data, error, isPending, refetch } = useProject(projectId, open && project !== null)
  const updateMutation = useUpdateProject(projectId)

  function handleSubmit(values: ProjectFormValues) {
    updateMutation.mutate(toProjectInput(values), {
      onSuccess: (updated) => {
        toast.success(`Saved changes to “${updated.projectName}”`)
        onClose()
      },
    })
  }

  const title = data?.projectName ?? (isNotFound(error) ? 'Project not found' : 'Edit project')

  return (
    <>
      <ProjectDrawer
        open={open && project !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !updateMutation.isPending) onClose()
        }}
        title={title}
        description={data ? `Project for ${getClientName(data.clientId)}` : undefined}
        closeDisabled={updateMutation.isPending}
      >
        {isPending ? (
          <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading project">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-10 animate-pulse rounded-md bg-line" />
            ))}
          </div>
        ) : isNotFound(error) ? (
          <NotFound title="Project not found" message="It may have been deleted." />
        ) : error ? (
          <ErrorPanel
            title="This project couldn’t be loaded."
            messages={errorMessages(error)}
            action={
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : data ? (
          <ProjectForm
            key={projectId}
            defaultValues={toFormValues(data)}
            submitLabel="Save changes"
            pendingLabel="Saving…"
            isPending={updateMutation.isPending}
            serverErrors={errorMessages(updateMutation.error)}
            onCancel={() => {
              if (!updateMutation.isPending) onClose()
            }}
            onSubmit={handleSubmit}
          />
        ) : null}
        {data ? (
          <div className="border-t border-line pt-4">
            <Button variant="secondary" onClick={() => setConfirmDelete(true)} className="hover:text-danger">
              Delete project
            </Button>
          </div>
        ) : null}
      </ProjectDrawer>
      <DeleteProjectDialog
        project={confirmDelete && open ? data ?? null : null}
        onClose={() => setConfirmDelete(false)}
        onDeleted={onClose}
      />
    </>
  )
}
