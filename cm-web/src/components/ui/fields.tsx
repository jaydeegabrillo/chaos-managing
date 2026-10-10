import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const control =
  'w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted/70 transition-colors hover:border-muted/60 focus-visible:border-primary aria-invalid:border-danger disabled:opacity-60'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(control, 'h-10', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(control, 'min-h-24 py-2 leading-relaxed', className)} {...props} />
}

/** Native select: accessible and mobile-friendly out of the box. */
export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(control, 'h-10 cursor-pointer pr-8', className)} {...props} />
}

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return <label className={cn('text-sm font-medium text-ink', className)} {...props} />
}

type FieldProps = {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: (aria: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => React.ReactNode
}

/** Label + control + error message, wired together for screen readers. */
export function Field({ id, label, error, hint, required, className, children }: FieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-danger" aria-hidden="true"> *</span> : null}
      </Label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
