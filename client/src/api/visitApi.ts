import axiosInstance from './axiosInstance'

import type { AddVisitFormData } from '../types/visit'

export async function getUserVisits() {
  const res = await axiosInstance.get(`/visits`)

  return res.data
}

export async function getVisitById(id: number) {
  const res = await axiosInstance.get(`/visits/${id}`)

  return res.data
}

export async function createVisit(data: AddVisitFormData) {
  const res = await axiosInstance.post(`/visits`, data)

  return res.data
}