import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { ErrorPanel } from '@/components/ui/error-panel'
import { Field, Input, Select, Textarea } from '@/components/ui/fields'
import { getClientName, getClientOptions } from '../clients'
import { projectFormSchema, type ProjectFormValues } from '../schema'
import { PROJECT_PRIORITIES, PROJECT_STATUSES } from '../types'

type ProjectFormProps = {
  defaultValues: ProjectFormValues
  submitLabel: string
  pendingLabel: string
  isPending: boolean
  clientReadOnly?: boolean
  serverErrors?: string[]
  onCancel?: () => void
  onSubmit: (values: ProjectFormValues) => void
}

export function ProjectForm({
  defaultValues,
  submitLabel,
  pendingLabel,
  isPending,
  clientReadOnly = false,
  serverErrors = [],
  onCancel,
  onSubmit,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: 'onTouched',
  })

  const clientOptions = getClientOptions(defaultValues.clientId ? Number(defaultValues.clientId) : undefined)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="projectName" label="Project name" required error={errors.projectName?.message} className="sm:col-span-2">
          {(aria) => <Input {...aria} autoComplete="off" {...register('projectName')} />}
        </Field>

        <Field id="clientId" label="Client" required error={errors.clientId?.message} className="sm:col-span-2">
          {(aria) => clientReadOnly ? (
            <>
              <Input {...aria} value={getClientName(Number(defaultValues.clientId))} disabled />
              <input id="clientId-value" type="hidden" {...register('clientId')} />
            </>
          ) : (
            <Select {...aria} {...register('clientId')}>
              <option value="">Choose a client</option>
              {clientOptions.map((client) => (
                <option key={client.id} value={String(client.id)}>
                  {client.name}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field id="description" label="Description" error={errors.description?.message} className="sm:col-span-2">
          {(aria) => <Textarea {...aria} rows={4} {...register('description')} />}
        </Field>

        <Field id="status" label="Status" required error={errors.status?.message}>
          {(aria) => (
            <Select {...aria} {...register('status')}>
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field id="priority" label="Priority" required error={errors.priority?.message}>
          {(aria) => (
            <Select {...aria} {...register('priority')}>
              {PROJECT_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field id="startDate" label="Start date" error={errors.startDate?.message}>
          {(aria) => <Input {...aria} type="date" {...register('startDate', { deps: ['dueDate'] })} />}
        </Field>

        <Field id="dueDate" label="Due date" error={errors.dueDate?.message} hint="">
          {(aria) => <Input {...aria} type="date" {...register('dueDate')} />}
        </Field>
      </div>

      {serverErrors.length > 0 ? (
        <ErrorPanel title="The project wasn’t saved." messages={serverErrors} />
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <Button asChild variant="secondary">
            <Link to="/projects">Cancel</Link>
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}
