import api from './axios'

export const getMessages = (noteId) => api.get(`/chat/${noteId}`)
export const sendMessage = (noteId, content) => api.post(`/chat/${noteId}`, { content })
