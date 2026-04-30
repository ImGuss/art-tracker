import axiosInstance from "./axiosInstance";

export async function getArtists(limit: number, offset: number, q: string | undefined) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset)
  })

  if (q) {
    params.append('q', q)
  }

  const res = await axiosInstance.get(`/artists?${params}`)

  return res.data
}

export async function getArtistById(id: number) {
  const res = await axiosInstance.get(`/artists/${id}`)
  
  return res.data
}