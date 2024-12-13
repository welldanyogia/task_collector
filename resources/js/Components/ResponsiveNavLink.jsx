import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-monza-400 bg-monza-50 text-monza-700 focus:border-monza-700 focus:bg-monza-100 focus:text-monza-800'
                    : 'border-transparent text-monza-600 hover:border-monza-300 hover:bg-monza-50 hover:text-monza-800 focus:border-monza-300 focus:bg-monza-50 focus:text-monza-800'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
