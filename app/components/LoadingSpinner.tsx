'use client'

import React from 'react'
import useLoading from "@/hooks/useLoading";

const LoadingSpinner = () => {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center shadow-xl">
        <div className="relative">
          {/* Cercle extérieur */}
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin"></div>
          {/* Cercle intérieur avec gradient */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-800 font-medium">Chargement en cours...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner 