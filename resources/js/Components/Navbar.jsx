import { useState } from "react";
import SigninModal from "@/Components/SigninModal.jsx";
import SignupModal from "@/Components/SignupModal.jsx";

export default function Navbar() {
    const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

    const appName = import.meta.env.VITE_APP_NAME || "Laravel";

    return (
        <>
            <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-gradient-to-r from-monza-700 to-monza-50 text-sm py-3">
                <nav className="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between">
                    <a className="sm:order-1 flex-none text-xl font-semibold dark:text-white focus:outline-none focus:opacity-80" href="#">
                        {appName}
                    </a>
                    <div className="sm:order-3 flex items-center gap-x-2">
                        <button
                            type="button"
                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border-2 border-monza-50 bg-monza-600 text-monza-50 shadow-sm hover:bg-monza-100 hover:text-monza-400 hover:border-monza-400 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                            onClick={() => setIsSigninModalOpen(true)}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsSignupModalOpen(true)}
                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border-2 border-monza-600 bg-monza-100 text-monza-600 shadow-sm hover:bg-monza-600 hover:text-monza-100 hover:border-monza-100 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            Sign up
                        </button>
                    </div>
                </nav>
            </header>

            {/* Render Modal */}
            {isSigninModalOpen && <SigninModal onClose={() => setIsSigninModalOpen(false)} openSignupModal={() => setIsSignupModalOpen(true)} />}
            {isSignupModalOpen && <SignupModal onClose={() => setIsSignupModalOpen(false)} openSigninModal={()=> setIsSigninModalOpen(true)}/>}
        </>
    );
}
