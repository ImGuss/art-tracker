import axiosInstance from './axiosInstance'

export async function getTagById(id: number, limit: number, offset:number) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset)
  })

  const res = await axiosInstance.get(`/tags/${id}?${params}`)

  return res.data
}