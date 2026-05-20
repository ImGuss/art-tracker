import axiosInstance from './axiosInstance'

export async function getUserCollections() {
  const res = await axiosInstance.get(`/collections`)

  return res.data
}