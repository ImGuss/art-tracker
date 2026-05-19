import axiosInstance from './axiosInstance'

import type { CreateMuseumData } from '../types/museum'

export async function getMuseums() {
  const res = await axiosInstance.get('/museums')

  return res.data
}

export async function getMuseumById(id: number) {
  const res = await axiosInstance.get(`/museums/${id}`)

  return res.data
}

export async function getVisitsByMuseum(id: number) {
  const res = await axiosInstance.get(`/museums/${id}/visits`)

  return res.data
}

export async function getArtworksByMuseum(id: number, limit: number, offset: number, q: string | undefined) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset)
  })

  if (q) {
    params.append('q', q)
  }

  const res = await axiosInstance.get(`/museums/${id}/artworks?${params}`)

  return res.data
}

export async function createMuseum(data: CreateMuseumData) {
  const res = await axiosInstance.post(`/museums`, data)

  return res.data
}