import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left Side: App Name */}
                <div className="text-white text-2xl font-bold">
                    Gesto
                </div>

                {/* Mobile menu button */}
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

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-10">
                            <ul className="flex flex-col space-y-2 p-2">
                                <li>
                                    <Link href="/" className="block px-4 py-2 text-white hover:bg-gray-600 rounded">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/restaurants" className="block px-4 py-2 text-white hover:bg-gray-600 rounded">
                                        Restaurants
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="block px-4 py-2 text-white hover:bg-gray-600 rounded">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="block px-4 py-2 text-white hover:bg-gray-600 rounded">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/signin" className="block px-4 py-2 text-white hover:bg-gray-600 rounded">
                                        Sign In
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Side: Desktop Navigation Links */}
                <div className="hidden md:flex space-x-6">
                    <Link href="/" className="text-white hover:text-gray-300">
                        Home
                    </Link>
                    <Link href="/restaurants" className="text-white hover:text-gray-300">
                        Restaurants
                    </Link>
                    <Link href="/about" className="text-white hover:text-gray-300">
                        About
                    </Link>
                    <Link href="/contact" className="text-white hover:text-gray-300">
                        Contact
                    </Link>
                    <Link href="/signin" className="text-white hover:text-gray-300">
                        Sign In
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
