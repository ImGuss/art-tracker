import axiosInstance from "./axiosInstance";

export async function getArtists(limit: number, offset: number) {
  const res = await axiosInstance.get(
    `/artists?limit=${limit}&offset=${offset}`
  )

  return res.data
}

export async function getArtistById(id: number) {
  const res = await axiosInstance.get(`/artists/${id}`)
  
  return res.data
}