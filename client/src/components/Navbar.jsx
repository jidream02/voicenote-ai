import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/home', icon: '📋', label: 'Заметки' },
  { path: '/record', icon: '🎙️', label: 'Запись' },
  { path: '/dashboard', icon: '📊', label: 'Статистика' },
  { path: '/profile', icon: '👤', label: 'Профиль' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="flex justify-around px-4 pt-3 pb-7 border-t border-[#1c1c1c] bg-[#080808]/95 backdrop-blur-xl">
      {NAV_ITEMS.map(item => {
        const active = location.pathname === item.path
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-opacity ${active ? 'opacity-100' : 'opacity-35'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className={`text-[10px] ${active ? 'text-violet-400' : 'text-[#888]'}`}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
