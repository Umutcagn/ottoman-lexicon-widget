import { cn } from '@/lib/utils'

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <BrandMark className="size-6" />
      <span className="font-serif text-lg font-bold tracking-tight text-foreground">
        Ottoman<span className="text-primary">Dict</span>
      </span>
    </div>
  )
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground',
        className,
      )}
      aria-hidden="true"
    >
      <span className="ottoman font-serif text-[0.9em] leading-none">ع</span>
    </span>
  )
}
