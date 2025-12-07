import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight, Pause, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'

gsap.registerPlugin(ScrollTrigger)

const HERO_IMAGES = [
    { src: "/images/hero.png", alt: "Titanium Collection" },
    { src: "/images/hero1.png", alt: "Urban Style" },
    { src: "/images/hero2.png", alt: "Summer Elegance" },
    { src: "/images/hero3.png", alt: "Active Lifestyle" },
    { src: "/images/hero4.png", alt: "Cozy Vibes" },
]

const Hero = () => {
    const heroRef = useRef(null)
    const textRef = useRef(null)
    const navigate = useNavigate()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)

    useEffect(() => {
        const tl = gsap.timeline()

        tl.fromTo(textRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 }
        )
    }, [])

    useEffect(() => {
        let interval
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
            }, 5000) // Change slide every 5 seconds
        }
        return () => clearInterval(interval)
    }, [isPlaying])

    const goToSlide = (index) => {
        setCurrentSlide(index)
        setIsPlaying(false) // Pause on manual interaction
    }

    return (
        <div ref={heroRef} className="bg-[#fbfbfd] min-h-screen pt-[48px] overflow-hidden font-sans">
            <div className="max-w-[2560px] mx-auto flex flex-col items-center pt-16 md:pt-24 pb-16 px-4">

                {/* Text Content */}
                <div ref={textRef} className="text-center max-w-4xl mx-auto mb-12 z-10">
                    <h1 className="text-[42px] md:text-[80px] leading-[1.05] font-semibold tracking-tight text-[#1d1d1f] mb-4">
                        FitCheck.
                    </h1>
                    <p className="text-[20px] md:text-[28px] leading-tight font-medium text-[#1d1d1f] mb-8">
                        Your personal AI stylist.
                    </p>

                    <div className="flex items-center justify-center space-x-6">
                        <Button
                            onClick={() => navigate('/tryon')}
                            className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full px-6 py-2 text-[17px] font-normal transition-all"
                        >
                            Try it now
                        </Button>

                    </div>
                </div>

                {/* Hero Carousel */}
                <div className="w-full max-w-[1200px] aspect-[16/9] md:aspect-[21/9] rounded-[30px] overflow-hidden shadow-2xl relative bg-gray-100 group">
                    {HERO_IMAGES.map((image, index) => (
                        <div
                            key={index}
                            className={cn(
                                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                                currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
                            )}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    ))}

                    {/* Carousel Controls */}
                    <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center space-x-3">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                        >
                            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                        </button>

                        <div className="flex space-x-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-2">
                            {HERO_IMAGES.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all duration-300",
                                        currentSlide === index ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
                                    )}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-0 right-0 text-center text-white/90 z-10 pointer-events-none">
                        <p className="text-lg font-medium drop-shadow-md transition-all duration-500 transform translate-y-0 opacity-100">
                            {HERO_IMAGES[currentSlide].alt}
                        </p>
                    </div>
                </div>

            </div>

            {/* Feature Grid (Bento-lite) */}
            <div className="max-w-[1200px] mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[30px] p-10 h-[500px] flex flex-col items-center justify-center text-center shadow-sm hover:scale-[1.01] transition-transform duration-500 border border-gray-100">
                    <h3 className="text-[40px] font-semibold mb-4 text-[#1d1d1f]">Virtual Try-On</h3>
                    <p className="text-[21px] text-gray-500 mb-8 max-w-md">See how it looks before you buy. Powered by advanced AI.</p>
                    <img src="/images/tryon.png" alt="Try On" className="h-64 object-contain rounded-xl shadow-sm" />
                </div>
                <div className="bg-black text-white rounded-[30px] p-10 h-[500px] flex flex-col items-center justify-center text-center shadow-sm hover:scale-[1.01] transition-transform duration-500 overflow-hidden relative">
                    <div className="z-10 relative">
                        <h3 className="text-[40px] font-semibold mb-4">Smart Wardrobe</h3>
                        <p className="text-[21px] text-gray-400 mb-8">Organize your style.</p>
                        <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-full transition-colors">
                            Explore
                        </Button>
                    </div>
                    <img src="/images/wardrobe.png" alt="Wardrobe" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                </div>
            </div>
        </div>
    )
}

export default Hero
