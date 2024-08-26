import { useState } from 'react';
import Link from 'next/link';
import {signIn, signOut, useSession} from "next-auth/react";
import {api} from "$/utils/api";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession(); // Get the session data


    return (
        <nav className="p-4 fixed top-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center">

                <Link href="/" className="text-[#a6f7a6] text-2xl font-bold">
                    Gesto
                </Link>

                <div className="md:hidden relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-10">
                            <ul className="flex flex-col space-y-2 p-2 menu menu-horizontal">
                                <li>
                                    <Link href="/" className="block px-2 py-2 text-white hover:bg-gray-600 rounded">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/restaurants" className="block px-2 py-2 text-white hover:bg-gray-600 rounded">
                                        Restaurants
                                    </Link>
                                </li>
                            
                                <li>
                                    {session ? (
                                        <>
                                            <li>
                                                <Link href="/profile" className="block px-2 py-2 text-white hover:bg-gray-600 rounded">
                                                    {session.user?.name}
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => signOut()}
                                                    className="block w-full text-left px-2 py-2 text-white hover:bg-gray-600 rounded"
                                                >
                                                    Sign Out
                                                </button>
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <button
                                                onClick={() => signIn()}
                                                className="block w-full text-left px-2 py-2 text-white hover:bg-gray-600 rounded"
                                            >
                                                Sign In
                                            </button>
                                        </li>
                                    )}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="hidden md:flex space-x-3">
                    <Link href="/" className="text-white hover:bg-gray-600 hover:text-[#a6f7a6] transition duration-300 ease-in-out px-2 py-1 rounded">
                        Home
                    </Link>
                    <Link href="/restaurants" className="text-white hover:bg-gray-600 hover:text-[#a6f7a6] transition duration-300 ease-in-out px-2 py-1 rounded">
                        Restaurants
                    </Link>
                    {session ? (
                        <>
                            <Link href="/profile" className="text-white hover:bg-gray-600 hover:text-[#a6f7a6] transition duration-300 ease-in-out px-2 py-1 rounded">
                                {session.user?.name}
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="text-white hover:bg-gray-600 hover:text-[#a6f7a6] transition duration-300 ease-in-out px-2 py-1 rounded"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="text-white hover:bg-gray-600 hover:text-[#a6f7a6] transition duration-300 ease-in-out px-2 py-1 rounded"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};


export default Navbar;
