'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[14px] font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 text-[15px] text-text-primary bg-white',
            'border rounded-lg outline-none transition-all duration-200',
            'placeholder:text-text-tertiary',
            'focus:border-primary focus:ring-2 focus:ring-primary/10',
            error
              ? 'border-error focus:border-error focus:ring-error/10'
              : 'border-border',
            'disabled:bg-surface disabled:text-text-tertiary disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-[13px] text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-[13px] text-text-tertiary">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
