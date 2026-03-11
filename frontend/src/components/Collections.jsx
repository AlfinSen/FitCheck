import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'

const COSTUMES = [
    { id: 1, name: "Red T-Shirt", image: "/costumes/c1.png?v=4", price: "$29.00", category: "Casual" },
    { id: 2, name: "Blue Hoodie", image: "/costumes/c2.png?v=4", price: "$49.00", category: "Streetwear" },
    { id: 3, name: "Black Jacket", image: "/costumes/c3.png?v=4", price: "$89.00", category: "Outerwear" },
    { id: 4, name: "White Dress", image: "/costumes/c4.png?v=4", price: "$59.00", category: "Elegant" },
]

const Collections = () => {
    return (
        <div className="min-h-screen bg-[#fbfbfd] pt-[48px] font-sans">
            {/* Header */}
            <div className="sticky top-[48px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-4">
                <div className="max-w-[1024px] mx-auto flex items-center justify-between">
                    <h1 className="text-[21px] font-semibold text-[#1d1d1f]">Latest Collection</h1>
                    <div className="text-[14px] text-gray-500">{COSTUMES.length} Items</div>
                </div>
            </div>

            <div className="max-w-[1024px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {COSTUMES.map((costume) => (
                        <div
                            key={costume.id}
                            className="group relative bg-white rounded-[24px] overflow-hidden border border-gray-200/50 hover:border-gray-300 hover:shadow-xl transition-all duration-500"
                        >
                            {/* Image Container */}
                            <div className="aspect-[4/5] w-full bg-[#f5f5f7] relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center p-8">
                                    <img
                                        src={costume.image}
                                        alt={costume.name}
                                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-[12px] font-medium text-[#0071e3] mb-1 uppercase tracking-wide">{costume.category}</p>
                                        <h3 className="text-[19px] font-semibold text-[#1d1d1f]">{costume.name}</h3>
                                    </div>
                                    <span className="text-[17px] font-medium text-[#1d1d1f]">{costume.price}</span>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <Link
                                        to="/tryon"
                                        className="inline-flex items-center text-[14px] font-medium text-[#0071e3] hover:text-[#0077ed] transition-colors group/link"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Try On Virtual
                                    </Link>

                                    <button className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] group-hover:bg-[#1d1d1f] group-hover:text-white transition-all duration-300">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Collections