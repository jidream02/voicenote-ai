import { create } from 'zustand'
import { getNotes, getNote, deleteNote as deleteNoteApi, getStats } from '../api/notes'

export const useNotesStore = create((set, get) => ({
  notes: [],
  currentNote: null,
  stats: null,
  isLoading: false,
  error: null,

  fetchNotes: async (params) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await getNotes(params)
      set({ notes: data.notes, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.error || 'Ошибка загрузки', isLoading: false })
    }
  },

  fetchNote: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await getNote(id)
      set({ currentNote: data.note, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.error || 'Заметка не найдена', isLoading: false })
    }
  },

  deleteNote: async (id) => {
    await deleteNoteApi(id)
    set({ notes: get().notes.filter(n => n.id !== id) })
  },

  fetchStats: async () => {
    try {
      const { data } = await getStats()
      set({ stats: data })
    } catch {}
  },

  addNote: (note) => set({ notes: [note, ...get().notes] }),
  clearCurrent: () => set({ currentNote: null })
}))
