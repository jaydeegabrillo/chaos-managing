import { AlertDialog as Primitive } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export const AlertDialog = Primitive.Root
export const AlertDialogCancel = Primitive.Cancel
export const AlertDialogAction = Primitive.Action

export function AlertDialogContent({ className, children, ...props }: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Overlay className="fixed inset-0 z-40 bg-ink/40" />
      <Primitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-line bg-surface p-6 shadow-xl',
          className,
        )}
        {...props}
      >
        {children}
      </Primitive.Content>
    </Primitive.Portal>
  )
}

export function AlertDialogTitle({ className, ...props }: ComponentProps<typeof Primitive.Title>) {
  return <Primitive.Title className={cn('font-display text-lg font-semibold', className)} {...props} />
}

export function AlertDialogDescription({ className, ...props }: ComponentProps<typeof Primitive.Description>) {
  return <Primitive.Description className={cn('mt-2 text-sm text-muted', className)} {...props} />
}
