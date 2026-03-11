import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Sparkles, Loader2, X, Shirt, RefreshCw } from 'lucide-react'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'

const API_BASE = "http://localhost:5001";

const TryOnPage = () => {
    // User Photo State
    const [personFile, setPersonFile] = useState(null)
    const [personPreview, setPersonPreview] = useState(null)
    
    // Garment Photo State
    const [garmentFile, setGarmentFile] = useState(null)
    const [garmentPreview, setGarmentPreview] = useState(null)
    
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [isServerReady, setIsServerReady] = useState(false)

    React.useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/health`)
                if (res.ok) setIsServerReady(true)
            } catch (e) {
                console.warn("Server not reachable yet")
            }
        }
        checkHealth()
    }, [])

    // User Dropzone
    const onDropPerson = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        setPersonFile(file)
        setPersonPreview(URL.createObjectURL(file))
        setResult(null)
    }, [])

    const { 
        getRootProps: getPersonRootProps, 
        getInputProps: getPersonInputProps, 
        isDragActive: isPersonDragActive 
    } = useDropzone({
        onDrop: onDropPerson,
        accept: { 'image/*': [] },
        multiple: false
    })

    // Garment Dropzone
    const onDropGarment = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        setGarmentFile(file)
        setGarmentPreview(URL.createObjectURL(file))
        setResult(null)
    }, [])

    const { 
        getRootProps: getGarmentRootProps, 
        getInputProps: getGarmentInputProps, 
        isDragActive: isGarmentDragActive 
    } = useDropzone({
        onDrop: onDropGarment,
        accept: { 'image/*': [] },
        multiple: false
    })

    const handleGenerate = async () => {
        if (!personFile || !garmentFile) return

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('userImage', personFile)
            formData.append('garmentImage', garmentFile)

            const response = await fetch(`${API_BASE}/api/tryon`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.details || 'Server error');
            }

            const data = await response.json()
            if (data.resultImage) {
                // Detect mime type or default to png
                const mimeType = data.resultImage.startsWith('/9j/') ? 'jpeg' : 'png';
                console.log(`Received result image, length: ${data.resultImage.length}`);
                setResult(`data:image/${mimeType};base64,${data.resultImage}`)
            } else {
                throw new Error('No result image returned from server');
            }
        } catch (error) {
            console.error("Error generating try-on:", error)
            alert(`Try-on failed: ${error.message}`);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fbfbfd] pt-[48px] font-sans pb-20">
            {/* Product Header */}
            <div className="sticky top-[48px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-4">
                <div className="max-w-[1024px] mx-auto flex items-center justify-between">
                    <h1 className="text-[21px] font-semibold text-[#1d1d1f]">Try-On Studio</h1>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 mr-2">
                            <div className={cn("w-2 h-2 rounded-full", isServerReady ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-amber-500")} />
                            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                                {isServerReady ? "AI System Ready" : "System Connecting..."}
                            </span>
                        </div>
                        <Button
                            onClick={handleGenerate}
                            disabled={!personFile || !garmentFile || loading || !isServerReady}
                            className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full px-6 py-1.5 text-[14px] font-medium h-9 disabled:opacity-50 transition-all shadow-sm"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Processing
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left: Person Upload */}
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-[19px] font-semibold text-[#1d1d1f] px-2">1. Your Photo</h2>
                        <div
                            {...getPersonRootProps()}
                            className={cn(
                                "relative aspect-[3/4] rounded-[24px] overflow-hidden transition-all duration-300 flex flex-col items-center justify-center bg-white shadow-sm border border-gray-200/50",
                                isPersonDragActive ? "border-[#0071e3] ring-4 ring-[#0071e3]/10" : "hover:border-gray-300",
                                !personPreview && "cursor-pointer"
                            )}
                        >
                            <input {...getPersonInputProps()} />
                            {personPreview ? (
                                <img src={personPreview} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-12 h-12 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="text-[15px] font-medium text-[#1d1d1f]">Person Photo</p>
                                    <p className="text-[13px] text-gray-500 mt-1">Upload yourself</p>
                                </div>
                            )}
                            {personPreview && !loading && !result && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setPersonFile(null); setPersonPreview(null); }}
                                    className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Middle: Garment Upload */}
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-[19px] font-semibold text-[#1d1d1f] px-2">2. Clothing Image</h2>
                        <div
                            {...getGarmentRootProps()}
                            className={cn(
                                "relative aspect-[3/4] rounded-[24px] overflow-hidden transition-all duration-300 flex flex-col items-center justify-center bg-white shadow-sm border border-gray-200/50",
                                isGarmentDragActive ? "border-[#0071e3] ring-4 ring-[#0071e3]/10" : "hover:border-gray-300",
                                !garmentPreview && "cursor-pointer"
                            )}
                        >
                            <input {...getGarmentInputProps()} />
                            {garmentPreview ? (
                                <img src={garmentPreview} alt="Garment" className="w-full h-full object-contain p-4" />
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-12 h-12 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shirt className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="text-[15px] font-medium text-[#1d1d1f]">Garment Item</p>
                                    <p className="text-[13px] text-gray-500 mt-1">PNG/JPG with clear bg preferred</p>
                                </div>
                            )}
                            {garmentPreview && !loading && !result && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setGarmentFile(null); setGarmentPreview(null); }}
                                    className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Result Display */}
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-[19px] font-semibold text-[#1d1d1f] px-2">3. Virtual Try-On</h2>
                        <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden bg-white shadow-sm border border-gray-200/50 flex items-center justify-center">
                            {result ? (
                                <img src={result} alt="Result" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-8 opacity-40">
                                    <Sparkles className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                                    <p className="text-[15px] font-medium">Result Preview</p>
                                    <p className="text-[13px] mt-1">Magic happens here</p>
                                </div>
                            )}

                            {loading && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-30">
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <Loader2 className="w-12 h-12 text-[#0071e3] animate-spin" />
                                            <Sparkles className="w-4 h-4 text-[#0071e3] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                        <p className="text-[17px] font-semibold text-[#1d1d1f] mt-6">Generating Outfit...</p>
                                        <p className="text-[13px] text-gray-500 mt-1 text-center px-6">We're using AI to perfectly fit the garment to your pose.</p>
                                    </div>
                                </div>
                            )}
                            
                            {result && (
                                <button
                                    onClick={() => setResult(null)}
                                    className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TryOnPage
