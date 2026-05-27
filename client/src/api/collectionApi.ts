import axiosInstance from './axiosInstance'

import type { AddCollectionFormData } from '../types/collection'

export async function getUserCollections() {
  const res = await axiosInstance.get(`/collections`)

  return res.data
}

export async function getCollectionById(id: number) {
  const res = await axiosInstance.get(`/collections/${id}`)

  return res.data
}

export async function createCollection(data: AddCollectionFormData) {
  const res = await axiosInstance.post(`/collections`, data)

  return res.data
}

export async function addArtworkToCollection(collectionId: number, artworkId: number) {
  const res = await axiosInstance.post(`/collections/${collectionId}/artworks/${artworkId}`)

  return res.data
}

export async function removeArtworkFromCollection(collectionId: number, artworkId: number) {
  const res = await axiosInstance.delete(`/collections/${collectionId}/artworks/${artworkId}`)

  return res.data
}