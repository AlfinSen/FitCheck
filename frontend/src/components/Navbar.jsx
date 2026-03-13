import React, { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
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
        { name: 'Collections', path: '/collections' },
        { name: 'Recent', path: '/recent' },
    ]

    return (
        <>
            <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300 h-[56px] flex items-center justify-center">
                <div className="max-w-[1200px] w-full px-5 grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] items-center text-[12px] font-normal tracking-tight">
                    <div className="flex items-center gap-4 justify-self-start">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-900"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <Link to="/" className="text-[18px] font-semibold tracking-tight text-gray-900 hover:opacity-80 transition-opacity">
                            FitCheck
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center justify-center space-x-2 justify-self-center rounded-full bg-[#f3f4f6] p-1.5">
                        {appNavItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={cn(
                                    "rounded-full px-4 py-1.5 text-[13px] text-gray-600 hover:text-black transition-all duration-300",
                                    location.pathname === item.path
                                        ? "bg-white text-black shadow-sm"
                                        : "hover:bg-white/70"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:block justify-self-end w-[88px]" />
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