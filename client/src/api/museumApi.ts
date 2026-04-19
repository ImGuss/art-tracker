import axiosInstance from './axiosInstance'

export async function getMuseums() {
  const res = await axiosInstance.get('/museums')

  return res.data
}