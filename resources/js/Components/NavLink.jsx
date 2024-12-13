import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-monza-400 text-monza-500 focus:border-monza-700'
                    : 'border-transparent text-monza-500 hover:border-monza-300 hover:text-monza-700 focus:border-monza-300 focus:text-monza-700') +
                className
            }
        >
            {children}
        </Link>
    );
}
