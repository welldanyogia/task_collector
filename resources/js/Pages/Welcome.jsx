import { Head, Link } from '@inertiajs/react';
import Navbar from "@/Components/Navbar.jsx";
import SigninModal from "@/Components/SigninModal.jsx";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <Navbar/>
            <div className={'w-full h-screen  bg-gradient-to-r from-monza-700 to-monza-50'}>
                <div className={'mx-auto  font-bold text-monza-50 text-6xl pt-16 text-center'}>
                    Task Collector
                </div>
            </div>
        </>
    );
}
