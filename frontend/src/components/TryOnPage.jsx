import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Sparkles, Loader2, X, Check, RefreshCw, ChevronRight } from 'lucide-react'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'

const COSTUMES = [
    { id: 1, name: "Red T-Shirt", image: "http://localhost:5001/costumes/c1.png?v=2", color: "bg-red-500" },
    { id: 2, name: "Blue Hoodie", image: "http://localhost:5001/costumes/c2.png?v=2", color: "bg-blue-500" },
    { id: 3, name: "Black Jacket", image: "http://localhost:5001/costumes/c3.png?v=2", color: "bg-gray-900" },
    { id: 4, name: "White Dress", image: "http://localhost:5001/costumes/c4.png?v=2", color: "bg-gray-100" },
]

const TryOnPage = () => {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [selectedCostume, setSelectedCostume] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        setFile(file)
        setPreview(URL.createObjectURL(file))
        setResult(null)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    })

    const handleGenerate = async () => {
        if (!file || !selectedCostume) return

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('userImage', file)
            formData.append('costumeId', selectedCostume.id)

            const response = await fetch('http://localhost:5001/api/tryon', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()
            if (data.resultImage) {
                setResult(`data:image/png;base64,${data.resultImage}`)
            }
        } catch (error) {
            console.error("Error generating try-on:", error)
        } finally {
            setLoading(false)
        }
    }

    const clearImage = (e) => {
        e.stopPropagation()
        setFile(null)
        setPreview(null)
        setResult(null)
    }

    return (
        <div className="min-h-screen bg-[#fbfbfd] pt-[48px] font-sans">
            {/* Product Header */}
            <div className="sticky top-[48px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-4">
                <div className="max-w-[1024px] mx-auto flex items-center justify-between">
                    <h1 className="text-[21px] font-semibold text-[#1d1d1f]">FitCheck Studio</h1>
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={handleGenerate}
                            disabled={!file || !selectedCostume || loading}
                            className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full px-4 py-1 text-[12px] font-normal h-8 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Generate"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1024px] mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">

                {/* Left: Preview Area (Sticky) */}
                <div className="flex-1 md:sticky md:top-[140px] h-fit">
                    <div
                        {...getRootProps()}
                        className={cn(
                            "relative w-full aspect-[3/4] rounded-[24px] overflow-hidden transition-all duration-300 flex flex-col items-center justify-center bg-white shadow-sm border border-gray-200/50",
                            isDragActive ? "border-[#0071e3] ring-4 ring-[#0071e3]/10" : "hover:border-gray-300",
                            !preview && !result && "cursor-pointer"
                        )}
                    >
                        <input {...getInputProps()} />

                        {result ? (
                            <img src={result} alt="Result" className="w-full h-full object-cover" />
                        ) : preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Upload className="w-6 h-6 text-[#1d1d1f]" />
                                </div>
                                <h3 className="text-[21px] font-semibold text-[#1d1d1f] mb-2">Upload Photo</h3>
                                <p className="text-[17px] text-gray-500">Drag and drop or click to browse</p>
                            </div>
                        )}

                        {(preview || result) && (
                            <button
                                onClick={clearImage}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors z-20"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {loading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
                                <div className="flex flex-col items-center">
                                    <Loader2 className="w-8 h-8 text-[#0071e3] animate-spin mb-4" />
                                    <p className="text-[17px] font-medium text-[#1d1d1f]">Analyzing fit...</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="text-center text-[12px] text-gray-400 mt-4">
                        Upload a full-body photo for best results.
                    </p>
                </div>

                {/* Right: Configuration */}
                <div className="w-full md:w-[360px] flex flex-col space-y-12">

                    {/* Section 1: Collection */}
                    <div>
                        <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-6">Choose your style.</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {COSTUMES.map((costume) => (
                                <div
                                    key={costume.id}
                                    onClick={() => setSelectedCostume(costume)}
                                    className={cn(
                                        "cursor-pointer rounded-[18px] p-4 border transition-all duration-200 flex flex-col items-center text-center bg-white",
                                        selectedCostume?.id === costume.id
                                            ? "border-[#0071e3] ring-1 ring-[#0071e3]"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    <div className="w-full aspect-square mb-4 relative">
                                        <img
                                            src={costume.image}
                                            alt={costume.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p className="text-[14px] font-medium text-[#1d1d1f]">{costume.name}</p>
                                    <div className="mt-2 flex items-center space-x-1">
                                        <div className={cn("w-3 h-3 rounded-full border border-gray-200", costume.color)}></div>
                                        <span className="text-[12px] text-gray-500">New</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TryOnPage
