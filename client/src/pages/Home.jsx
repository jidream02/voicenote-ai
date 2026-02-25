import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useNotesStore } from '../store/notesStore'
import NoteCard from '../components/NoteCard'
import Navbar from '../components/Navbar'

const MODES = ['', 'ROADMAP', 'PROBLEM_SOLVER', 'MENTOR', 'MEETING_NOTES', 'REFLECTION']
const MODE_LABELS_SHORT = { '': 'Все', ROADMAP: 'Роадмап', PROBLEM_SOLVER: 'Проблемы', MENTOR: 'Ментор', MEETING_NOTES: 'Митинг', REFLECTION: 'Рефлексия' }

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { notes, isLoading, fetchNotes } = useNotesStore()
  const [search, setSearch] = useState('')
  const [activeMode, setActiveMode] = useState('')

  useEffect(() => {
    fetchNotes({ search, mode: activeMode || undefined })
  }, [search, activeMode])

  const firstName = user?.name?.split(' ')[0] || 'друг'

  return (
    <div className="flex flex-col min-h-screen bg-[#080808]">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-14 pb-4">
          <div>
            <p className="text-xs text-[#888]">Привет, {firstName} 👋</p>
            <h1 className="text-xl font-bold tracking-tight">Твои заметки</h1>
          </div>
          <div
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
          >
            {firstName[0]?.toUpperCase()}
          </div>
        </div>

        {/* Search */}
        <div className="mx-5 mb-4 bg-[#161616] border border-[#1c1c1c] rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-[#555]">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по заметкам..."
            className="bg-transparent text-sm text-[#f0f0f0] placeholder-[#555] flex-1 focus:outline-none"
          />
        </div>

        {/* Mode filter */}
        <div className="flex gap-2 px-5 mb-4 overflow-x-auto">
          {MODES.map(mode => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs border transition-all ${
                activeMode === mode
                  ? 'bg-violet-700/30 border-violet-500 text-violet-300'
                  : 'bg-[#161616] border-[#1c1c1c] text-[#888]'
              }`}
            >
              {MODE_LABELS_SHORT[mode]}
            </button>
          ))}
        </div>

        {/* Notes */}
        <div className="px-5 flex flex-col gap-3 pb-6">
          {isLoading ? (
            <p className="text-center text-[#555] text-sm py-10">Загрузка...</p>
          ) : notes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🎙️</p>
              <p className="text-[#555] text-sm">Заметок пока нет.<br />Нажми на кнопку ниже чтобы записать первую.</p>
            </div>
          ) : (
            notes.map(note => <NoteCard key={note.id} note={note} />)
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/record')}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-[18px] flex items-center justify-center text-2xl z-10"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
      >
        🎙️
      </button>

      <Navbar />
    </div>
  )
}
