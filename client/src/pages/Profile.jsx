import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useNotesStore } from '../store/notesStore'
import Navbar from '../components/Navbar'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { stats } = useNotesStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const firstName = user?.name?.split(' ')[0] || '?'
  const since = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru', { month: 'long', year: 'numeric' }) : ''

  const SETTINGS = [
    { section: 'Аккаунт', items: [
      { icon: '👤', label: 'Редактировать профиль', action: null },
      { icon: '🔔', label: 'Уведомления', action: null },
      { icon: '🌐', label: 'Язык — Русский', action: null },
    ]},
    { section: 'AI настройки', items: [
      { icon: '🤖', label: 'Модель — GPT-4o', action: null },
      { icon: '🔑', label: 'OpenAI API ключ', action: null },
    ]},
    { section: 'Данные', items: [
      { icon: '📥', label: 'Экспорт всех заметок', action: null },
      { icon: '🚪', label: 'Выйти', action: handleLogout, danger: true },
    ]},
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#080808]">
      <div className="flex-1 overflow-y-auto px-5 pt-14 pb-6">
        {/* Profile hero */}
        <div className="flex flex-col items-center py-6 mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-3.5"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}
          >
            {firstName[0]?.toUpperCase()}
          </div>
          <p className="text-xl font-bold">{user?.name || 'Пользователь'}</p>
          <p className="text-sm text-[#888] mt-0.5">{user?.email}</p>
          {since && <p className="text-xs text-[#555] mt-1.5">Участник с {since}</p>}

          <div className="flex gap-6 mt-5">
            <div className="text-center">
              <p className="text-xl font-bold text-violet-300">{stats?.total || 0}</p>
              <p className="text-xs text-[#555]">заметок</p>
            </div>
            <div className="w-px bg-[#1c1c1c]" />
            <div className="text-center">
              <p className="text-xl font-bold">
                {Math.round((stats?.recentNotes?.reduce((a, n) => a + (n.duration || 0), 0) || 0) / 60)}
              </p>
              <p className="text-xs text-[#555]">минут</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        {SETTINGS.map(section => (
          <div key={section.section} className="mb-5">
            <p className="text-[11px] text-[#555] uppercase tracking-wider mb-2 px-1">{section.section}</p>
            <div className="bg-[#161616] border border-[#1c1c1c] rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  onClick={item.action || undefined}
                  className={`w-full flex items-center gap-3.5 px-4 py-4 text-left transition-colors hover:bg-[#1a1a1a] ${
                    i < section.items.length - 1 ? 'border-b border-[#1c1c1c]' : ''
                  }`}
                >
                  <span className="text-xl w-7 text-center">{item.icon}</span>
                  <span className={`flex-1 text-sm ${item.danger ? 'text-red-400' : ''}`}>{item.label}</span>
                  <span className="text-[#555] text-sm">›</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Navbar />
    </div>
  )
}
