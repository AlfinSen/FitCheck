import React, { useEffect, useRef, useState } from 'react'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'
import { gsap } from 'gsap'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'

const Navbar = () => {
    const navRef = useRef(null)
    const mobileMenuRef = useRef(null)
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        gsap.fromTo(navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        )
    }, [])

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
            gsap.fromTo(mobileMenuRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            )
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    // Simplified for the app context, but keeping the aesthetic
    const appNavItems = [
        { name: 'Home', path: '/' },
        { name: 'Try-On Studio', path: '/tryon' },
        { name: 'Collections', path: '#' },
    ]

    return (
        <>
            <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300 h-[48px] flex items-center justify-center">
                <div className="max-w-[1024px] w-full px-4 flex items-center justify-between text-[12px] font-normal tracking-tight">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-900"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <Link to="/" className="text-lg font-semibold tracking-tight text-gray-900 hover:opacity-80 transition-opacity">
                            FitCheck
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {appNavItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={cn(
                                    "text-gray-600 hover:text-black transition-colors duration-300",
                                    location.pathname === item.path && "text-black"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="text-gray-600 hover:text-black transition-colors">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-white md:hidden flex flex-col">
                    <div className="h-[48px] flex items-center justify-between px-4 border-b border-gray-100">
                        <span className="text-lg font-semibold tracking-tight text-gray-900">FitCheck</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-gray-900 p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div ref={mobileMenuRef} className="flex-1 overflow-y-auto py-8 px-6 flex flex-col space-y-6">
                        {appNavItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-[28px] font-semibold text-[#1d1d1f] hover:text-gray-600 transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar