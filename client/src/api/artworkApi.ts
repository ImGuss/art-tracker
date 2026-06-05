import axiosInstance from './axiosInstance'

import type { CreateArtworkData } from '../types/artwork'

export async function getArtworks(limit: number, offset: number, q?: string) {

  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  if (q) {
    params.append('q', q)
  }

  const res = await axiosInstance.get(
    `/artworks?${params}`
  )

  return res.data
}

export async function getArtworkById(id: number) {
  const res = await axiosInstance.get(`/artworks/${id}`)

  return res.data
}

export async function createArtwork(data: CreateArtworkData) {
  const res = await axiosInstance.post(`/artworks`, data)

  return res.data
}