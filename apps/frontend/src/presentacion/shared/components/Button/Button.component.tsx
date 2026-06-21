import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Size, Variant } from "@shared/components/Button/Button.types";

interface ButtonComponentProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
        children: ReactNode;
        variant?: Variant;
        size?: Size
    }

export function ButtonComponent({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}: ButtonComponentProps) {

    const variants: Record<Variant , string> = {
        primary:
        'bg-indigo-600 text-white hover:bg-indigo-700',

        secondary_gray:
        'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',

        danger:
        'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
        
        navbar_button: 
        'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',

        dropdown:
        'text-gray-700 dark:text-gray-300  hover:text-indigo-600 dark:hover:text-indigo-400',

        pagination:
        'border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800',

        custom: 
        ''
    };

    const sizes: Record<Size , string> = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        none: ''
    };

    return (
        <button
        className={`
            ${variants[variant]}
            ${sizes[size]}
            ${className}
        `}
        {...props}
        >
        {children}
        </button>
    );
}