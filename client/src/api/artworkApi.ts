import axiosInstance from './axiosInstance'

export async function getArtworks(limit: number, offset: number) {
  const res = await axiosInstance.get(
    `/artworks?limit=${limit}&offset=${offset}`
  )

  return res.data
}

export async function getArtworkById(id: number) {
  const res = await axiosInstance.get(`/artworks/${id}`)

  return res.data
}