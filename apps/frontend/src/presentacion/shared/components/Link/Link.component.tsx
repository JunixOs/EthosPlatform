import type { ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

import type { Variant, Size } from "@/shared/components/Link/Link.types";

interface LinkComponentProps extends LinkProps {
    variant?: Variant;
    size?: Size;
    children: ReactNode;
}

export function LinkComponent({
    to,
    variant = 'navbar',
    size = 'sm',
    children,
    className = '',
    ...props
}: LinkComponentProps) {

    const variants: Record<Variant , string> = {
        navbar:
        'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400',

        navbar_main:
        'text-indigo-600 dark:text-indigo-400',

        primary_button_indigo:
        'bg-indigo-600 hover:bg-indigo-700 text-white',

        secondary_button_indigo_edge:
        'border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950',

        dropdown:
        'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30',

        card_type:
        'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600',

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
        <Link
            to={to}
            className={`
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            {...props}
        >
            {children}
        </Link>
    )
}