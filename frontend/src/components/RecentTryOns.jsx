import React, { useState, useEffect } from 'react'
import { Download, Trash2, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const TRYONS_KEY = 'fitcheck-recent-tryons'

const RecentTryOns = () => {
    const [recentTryOns, setRecentTryOns] = useState([])

    useEffect(() => {
        const savedTryOns = localStorage.getItem(TRYONS_KEY)
        if (savedTryOns) {
            try {
                const parsed = JSON.parse(savedTryOns)
                setRecentTryOns(parsed)
            } catch (e) {
                console.error('Error loading recent try-ons:', e)
            }
        }
    }, [])

    const deleteTryOn = (id) => {
        setRecentTryOns(prev => {
            const updated = prev.filter(item => item.id !== id)
            localStorage.setItem(TRYONS_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const downloadTryOn = (tryOn) => {
        const link = document.createElement('a')
        link.href = tryOn.resultImage || tryOn.image
        link.download = `fitcheck-${tryOn.garmentName}-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const clearAll = () => {
        localStorage.setItem(TRYONS_KEY, JSON.stringify([]))
        setRecentTryOns([])
    }

    return (
        <div className="min-h-screen bg-[#fbfbfd] pt-[48px] font-sans">
            {/* Header */}
            <div className="sticky top-[48px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-4">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <h1 className="text-[21px] font-semibold text-[#1d1d1f]">Recent Try-Ons</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-[14px] text-gray-500">{recentTryOns.length} Results</span>
                        {recentTryOns.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="text-[14px] text-red-500 hover:text-red-600 font-medium transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 py-12">
                {recentTryOns.length > 0 ? (
                    <div className="space-y-8">
                        {recentTryOns.map((tryOn) => (
                            <div
                                key={tryOn.id}
                                className="group bg-white rounded-[24px] overflow-hidden border border-gray-200/50 hover:border-gray-300 hover:shadow-lg transition-all duration-300 p-6"
                            >
                                {/* Header with info and actions */}
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{tryOn.garmentName}</h3>
                                        <p className="text-[13px] text-gray-500 mt-1">
                                            {new Date(tryOn.createdAt).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => downloadTryOn(tryOn)}
                                            className="p-2 bg-[#f5f5f7] hover:bg-[#0071e3] rounded-full text-gray-600 hover:text-white transition-colors"
                                            title="Download Result"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteTryOn(tryOn.id)}
                                            className="p-2 bg-[#f5f5f7] hover:bg-red-500 rounded-full text-gray-600 hover:text-white transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Three images in a row */}
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Uploaded Image */}
                                    <div className="flex flex-col">
                                        <p className="text-[13px] font-medium text-gray-500 mb-3 text-center">Uploaded Photo</p>
                                        <div className="aspect-[3/4] bg-[#f5f5f7] rounded-[16px] overflow-hidden">
                                            <img
                                                src={tryOn.personImage || tryOn.image}
                                                alt="Person"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Garment */}
                                    <div className="flex flex-col relative">
                                        <p className="text-[13px] font-medium text-gray-500 mb-3 text-center">Garment</p>
                                        <div className="aspect-[3/4] bg-[#f5f5f7] rounded-[16px] overflow-hidden flex items-center justify-center p-4">
                                            {tryOn.garmentImage ? (
                                                <img
                                                    src={tryOn.garmentImage}
                                                    alt="Garment"
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-center text-gray-400">
                                                    <Sparkles className="w-8 h-8 mx-auto mb-2" />
                                                    <p className="text-[12px]">No preview</p>
                                                </div>
                                            )}
                                        </div>
                                        {/* Arrow indicators */}
                                        <div className="absolute top-1/2 -left-2 transform -translate-y-1/2">
                                            <div className="w-4 h-4 text-gray-300">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
                                            <div className="w-4 h-4 text-gray-300">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Result */}
                                    <div className="flex flex-col">
                                        <p className="text-[13px] font-medium text-[#0071e3] mb-3 text-center">Result</p>
                                        <div className="aspect-[3/4] bg-[#f5f5f7] rounded-[16px] overflow-hidden ring-2 ring-[#0071e3]/20">
                                            <img
                                                src={tryOn.resultImage || tryOn.image}
                                                alt="Result"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-[19px] font-semibold text-[#1d1d1f] mb-2">No Try-Ons Yet</h2>
                        <p className="text-[15px] text-gray-500 mb-6">Your generated outfits will appear here</p>
                        <Link
                            to="/tryon"
                            className="inline-flex items-center px-6 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-[14px] font-medium transition-colors"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Start Try-On
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RecentTryOns
