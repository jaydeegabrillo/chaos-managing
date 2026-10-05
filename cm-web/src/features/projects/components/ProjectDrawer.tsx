import { Dialog as Primitive } from 'radix-ui'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type ProjectDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  closeDisabled?: boolean
  children: ReactNode
}

export function ProjectDrawer({ open, onOpenChange, title, description, closeDisabled = false, children }: ProjectDrawerProps) {
  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Primitive.Portal>
        <Primitive.Overlay className="project-drawer-overlay fixed inset-0 z-40 bg-ink/40" />
        <Primitive.Content className="project-drawer-content fixed inset-y-0 right-0 z-50 flex h-dvh w-full flex-col overflow-visible border-l border-line bg-surface p-6 shadow-xl outline-none sm:w-[min(42rem,90vw)] sm:p-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center">
            <Primitive.Close asChild>
              <Button
                variant="secondary"
                size="icon"
                aria-label="Close project form"
                disabled={closeDisabled}
                className="pointer-events-auto -translate-x-1/2 rounded-full border-0 shadow-md"
              >
                <ArrowRight aria-hidden="true" />
              </Button>
            </Primitive.Close>
          </div>
          <div className="flex items-start gap-4 border-b border-line pb-5">
            <div>
              <Primitive.Title className="font-display text-2xl font-bold tracking-tight">{title}</Primitive.Title>
              {description ? <Primitive.Description className="mt-1 text-sm text-muted">{description}</Primitive.Description> : null}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto py-6">{children}</div>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  )
}
