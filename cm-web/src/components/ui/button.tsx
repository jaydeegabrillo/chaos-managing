import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover',
        secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
        ghost: 'text-muted hover:bg-canvas hover:text-ink',
        danger: 'bg-danger text-white hover:bg-danger/90',
      },
      size: {
        md: 'h-10 px-4',
        sm: 'h-8 px-3',
        icon: 'size-8',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ className, variant, size, asChild = false, type = 'button', ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...(asChild ? {} : { type })}
      {...props}
    />
  )
}
