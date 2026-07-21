import type { HTMLAttributes, ReactNode } from "react";
import type { Variant } from "./Card.types";

interface CardComponentProps
    extends HTMLAttributes<HTMLDivElement> {
        children: ReactNode;
        variant?: Variant;
}

export function CardComponent ({
    children,
    variant = 'default',
    className = '',
    ...props
}: Readonly<CardComponentProps>) {
    const variants: Record<Variant, string> = {
        default: '',

        hover:
            'hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all',

        outlined:
            'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
    };

    return (
        <div
        className={`
            rounded-xl

            ${variants[variant]}
            ${className}
        `}
        {...props}
        >
        {children}
        </div>
    );
}