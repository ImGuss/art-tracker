import axiosInstance from './axiosInstance'

export async function getMuseums() {
  const res = await axiosInstance.get('/museums')

  return res.data
}

export async function getMuseumById(id: number) {
  const res = await axiosInstance.get(`/museums/${id}`)

  return res.data
}