import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // BASE STYLES: Enhanced for Modern UI
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 " +
  "relative overflow-hidden group " + // Added for better hover/focus effects
  "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 " +
  "outline-none focus-visible:z-10 focus-visible:ring-4 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // --- NEW GLASS MORPHISM VARIANT ---
        glass:
          // Glass Background Effect
          'backdrop-blur-sm bg-white/20 dark:bg-black/20 text-foreground ' +
          // Advanced Shadow and Stroke
          'border border-white/30 dark:border-white/10 shadow-lg shadow-black/10 dark:shadow-black/30 ' +
          // Hover Effects
          'hover:bg-white/30 dark:hover:bg-black/30 hover:border-white/50 dark:hover:border-white/20 ' +
          'active:bg-white/10 dark:active:bg-black/10',

        // --- UPDATED DEFAULT & EXISTING VARIANTS ---
        default: 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-md hover:bg-destructive/90 dark:bg-destructive/70 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          // Modern subtle stroke for outline
          'border border-input bg-background shadow-sm hover:bg-accent/80 hover:text-accent-foreground dark:bg-input/10 dark:border-input/50 dark:hover:bg-input/20',
        secondary:
          'bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80',
        ghost:
          'hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/30',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2 has-[>svg]:px-4', // Slightly taller for modern feel
        sm: 'h-9 rounded-lg gap-2 px-3.5 has-[>svg]:px-3',
        lg: 'h-11 rounded-xl px-7 has-[>svg]:px-5',
        icon: 'size-10',
        'icon-sm': 'size-9',
        'icon-lg': 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }