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

export async function createMuseum(data: CreateMuseumData) {
  const res = await axiosInstance.post(`/museums`, data)

  return res.data
}