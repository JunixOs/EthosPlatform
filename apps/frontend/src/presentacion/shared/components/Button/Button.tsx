import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Size, Variant } from "./Button.types";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
        children: ReactNode;
        variant?: Variant;
        size?: Size
    }

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}: ButtonProps) {

    const variants = {
        primary:
        'bg-indigo-600 hover:bg-indigo-700 text-white',

        secondary:
        'bg-gray-200 hover:bg-gray-300 text-gray-900',

        danger:
        'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
    };

    const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
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