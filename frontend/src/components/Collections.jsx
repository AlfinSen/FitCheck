import React, { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, Upload, X, Plus, Save } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { cn } from '../lib/utils'

const STORAGE_KEY = 'fitcheck-custom-garments'

const COSTUMES = [
    { id: 1, name: "Red T-Shirt", image: "/costumes/c1.png?v=4", category: "Casual" },
    { id: 2, name: "Blue Hoodie", image: "/costumes/c2.png?v=4", category: "Streetwear" },
    { id: 3, name: "Black Jacket", image: "/costumes/c3.png?v=4", category: "Outerwear" },
]

// Convert file to base64 for storage
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

const Collections = () => {
    const navigate = useNavigate()
    const [customImages, setCustomImages] = useState([])

    // Load saved images from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setCustomImages(parsed)
            } catch (e) {
                console.error('Error loading saved garments:', e)
            }
        }
    }, [])

    // Save images to localStorage whenever customImages changes
    const saveToStorage = useCallback(() => {
        const toSave = customImages.filter(img => img.base64) // Only save items with base64 data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    }, [customImages])

    const onDropCustom = useCallback(async (acceptedFiles) => {
        const newImages = await Promise.all(acceptedFiles.map(async (file, index) => {
            const base64 = await fileToBase64(file)
            return {
                id: `custom-${Date.now()}-${index}`,
                name: file.name.replace(/\.[^/.]+$/, ""),
                image: base64,
                base64: base64,
                category: "Your Upload",
                isCustom: true,
                saved: false
            }
        }))
        setCustomImages(prev => [...prev, ...newImages])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onDropCustom,
        accept: { 'image/*': [] },
        multiple: true
    })

    const removeCustomImage = (id) => {
        setCustomImages(prev => {
            const updated = prev.filter(img => img.id !== id)
            // Update localStorage immediately
            const toSave = updated.filter(img => img.saved)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
            return updated
        })
    }

    const saveImage = (id) => {
        setCustomImages(prev => {
            const updated = prev.map(img => 
                img.id === id ? { ...img, saved: true } : img
            )
            // Save to localStorage
            const toSave = updated.filter(img => img.saved)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
            return updated
        })
    }

    const handleTryOn = (costume) => {
        // Navigate to try-on page with the garment image
        const imageUrl = costume.isCustom ? costume.image : costume.image
        navigate(`/tryon?garment=${encodeURIComponent(imageUrl)}&name=${encodeURIComponent(costume.name)}`)
    }

    const allItems = [...customImages, ...COSTUMES]

    return (
        <div className="min-h-screen bg-[#fbfbfd] pt-[48px] font-sans">
            {/* Header */}
            <div className="sticky top-[48px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-4">
                <div className="max-w-[1024px] mx-auto flex items-center justify-between">
                    <h1 className="text-[21px] font-semibold text-[#1d1d1f]">Latest Collection</h1>
                    <div className="text-[14px] text-gray-500">{allItems.length} Items</div>
                </div>
            </div>

            <div className="max-w-[1024px] mx-auto px-4 py-12">
                {/* Custom Upload Section */}
                <div className="mb-12">
                    <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-4">Upload Your Own Garments</h2>
                    <div
                        {...getRootProps()}
                        className={cn(
                            "border-2 border-dashed rounded-[20px] p-8 text-center cursor-pointer transition-all duration-300",
                            isDragActive 
                                ? "border-[#0071e3] bg-[#0071e3]/5" 
                                : "border-gray-300 hover:border-gray-400 bg-white"
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="w-14 h-14 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-[15px] font-medium text-[#1d1d1f]">
                            {isDragActive ? "Drop images here..." : "Drop garment images or click to upload"}
                        </p>
                        <p className="text-[13px] text-gray-500 mt-1">PNG/JPG recommended</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allItems.map((costume) => (
                        <div
                            key={costume.id}
                            className="group relative bg-white rounded-[24px] overflow-hidden border border-gray-200/50 hover:border-gray-300 hover:shadow-xl transition-all duration-500"
                        >
                            {/* Remove button for custom uploads */}
                            {costume.isCustom && (
                                <div className="absolute top-3 right-3 z-10 flex space-x-2">
                                    {!costume.saved && (
                                        <button
                                            onClick={() => saveImage(costume.id)}
                                            className="p-1.5 bg-green-500/80 hover:bg-green-500 backdrop-blur-md rounded-full text-white transition-colors"
                                            title="Save to collection"
                                        >
                                            <Save className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => removeCustomImage(costume.id)}
                                        className="p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
                                        title="Remove"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {costume.isCustom && costume.saved && (
                                <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-green-500/80 backdrop-blur-md rounded-full">
                                    <span className="text-[10px] font-medium text-white uppercase">Saved</span>
                                </div>
                            )}

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
                                        <p className={cn(
                                            "text-[12px] font-medium mb-1 uppercase tracking-wide",
                                            costume.isCustom ? "text-purple-600" : "text-[#0071e3]"
                                        )}>{costume.category}</p>
                                        <h3 className="text-[19px] font-semibold text-[#1d1d1f]">{costume.name}</h3>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <button
                                        onClick={() => handleTryOn(costume)}
                                        className="inline-flex items-center text-[14px] font-medium text-[#0071e3] hover:text-[#0077ed] transition-colors group/link"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Try On Virtual
                                    </button>

                                    <button 
                                        onClick={() => handleTryOn(costume)}
                                        className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] group-hover:bg-[#1d1d1f] group-hover:text-white transition-all duration-300"
                                    >
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