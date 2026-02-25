import api from './axios'

export const getNotes = (params) => api.get('/notes', { params })
export const getNote = (id) => api.get(`/notes/${id}`)
export const deleteNote = (id) => api.delete(`/notes/${id}`)
export const getStats = () => api.get('/notes/stats')
export const uploadAudio = (formData, onProgress) =>
  api.post('/audio/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total))
  })
