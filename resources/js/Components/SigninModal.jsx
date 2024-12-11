import {useForm} from "@inertiajs/react";
import InputError from "@/Components/InputError.jsx";

export default function SigninModal({onClose,openSignupModal}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        console.log("Form data:", data); // Debug data sebelum dikirim

        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: () => {
                console.log("Login successful!");
            },
            onError: (error) => {
                console.error("Login failed with errors:", error);
            },
        });

    };

    return (
        <div
            className={"fixed inset-0 z-[80] flex items-center justify-center bg-monza-100/50"}
            role="dialog"
            aria-labelledby="signin-modal-label"
        >
            <div
                className="bg-monza-50 border border-monza-600 shadow-sm rounded-xl w-full max-w-lg p-6 "
            >
                <div className="flex justify-end items-center">
                    <button
                        type="button"
                        className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-monza-100 text-monza-800 hover:bg-monza-200 focus:outline-none focus:bg-monza-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-monza-700 dark:hover:bg-monza-600 dark:text-monza-400 dark:focus:bg-monza-600"
                        aria-label="Close"
                        onClick={onClose} // Tutup Modal
                    >
                        <span className="sr-only">Close</span>
                        <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="py-4">
                    <div className="p-4 sm:p-7">
                        <div className="text-center">
                            <h1 className="block text-2xl font-bold text-monza-800">Sign in</h1>
                            <p className="mt-2 text-sm text-monza-400">
                                Don't have an account yet?
                                <button className="text-monza-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-monza-500"
                                   type="button" onClick={() => {
                                    onClose(); // Tutup modal signin
                                    openSignupModal(); // Buka modal signup
                                }}>
                                    Sign up here
                                </button>
                            </p>
                        </div>

                        <div className="mt-5">

                            {/*// <!-- Form -->*/}
                            <form onSubmit={submit}>
                                <div className="grid gap-y-4">
                                    {/*// <!-- Form Group -->*/}
                                    <div>
                                        <label htmlFor="email"
                                               className="block text-sm mb-2 text-monza-600">Email</label>
                                        <div className="relative">
                                            <input  id="email"
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    autoComplete="email"
                                                    onChange={(e) => setData('email', e.target.value)}
                                                   className="py-3 px-4 block w-full bg-monza-100 border-monza-200 rounded-lg text-sm focus:border-monza-500 focus:ring-monza-500 disabled:opacity-50 disabled:pointer-events-none  text-monza-400 placeholder-monza-500 "
                                                   required />
                                            <div
                                                className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                                <svg className="size-5 text-red-500" width="16" height="16"
                                                     fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                    <path
                                                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <InputError message={errors.email} className="text-xs text-red-600 mt-2" />
                                    </div>
                                    {/*// <!-- End Form Group -->*/}

                                    {/*// <!-- Form Group -->*/}
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <label htmlFor="password"
                                                   className="block text-sm mb-2 dark:text-monza-600">Password</label>
                                            <a className="inline-flex items-center gap-x-1 text-sm text-monza-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-monza-500"
                                               href="../examples/html/recover-account.html">Forgot password?</a>
                                        </div>
                                        <div className="relative">
                                            <input id="password"
                                                   type="password"
                                                   name="password"
                                                   value={data.password}
                                                   autoComplete="current-password"
                                                   onChange={(e) => setData('password', e.target.value)}
                                                   className="py-3 px-4 block w-full bg-monza-100 border-monza-200 rounded-lg text-sm focus:border-monza-500 focus:ring-monza-500 disabled:opacity-50 disabled:pointer-events-none  text-monza-400 placeholder-monza-500"
                                                   required />
                                            <div
                                                className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                                <svg className="size-5 text-red-500" width="16" height="16"
                                                     fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                    <path
                                                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <InputError message={errors.password} className="text-xs text-red-600 mt-2" />
                                    </div>
                                    {/*// <!-- End Form Group -->*/}

                                    {/*// <!-- Checkbox -->*/}
                                    <div className="flex items-center">
                                        <div className="flex">
                                            <input id="remember" name="remember" type="checkbox"
                                                   onChange={(e) =>
                                                       setData('remember', e.target.checked)}
                                                   className="shrink-0 mt-0.5 border-monza-200 rounded text-monza-600 focus:ring-monza-500 dark:bg-monza-800 dark:border-neutral-700 dark:checked:bg-monza-500 dark:checked:border-monza-500 dark:focus:ring-offset-gray-800"/>
                                        </div>
                                        <div className="ms-3">
                                            <label htmlFor="remember" className="text-sm text-monza-600">Remember
                                                me</label>
                                        </div>
                                    </div>
                                    {/*// <!-- End Checkbox -->*/}

                                    <button type="submit" disabled={processing}
                                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-monza-600 text-white hover:bg-monza-700 focus:outline-none focus:bg-monza-700 disabled:opacity-50 disabled:pointer-events-none">Sign
                                        in
                                    </button>
                                </div>
                            </form>
                            {/*// <!-- End Form -->*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
