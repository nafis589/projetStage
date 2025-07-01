'use client'

import { create } from 'zustand'

interface LoadingStore {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const useLoading = create<LoadingStore>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}))

export default useLoading 