import { useEffect } from 'react'
import { useNotesStore } from '../store/notesStore'
import Navbar from '../components/Navbar'

const MODE_INFO = {
  ROADMAP: { label: 'Роадмап', icon: '🗺️', color: '#60a5fa' },
  PROBLEM_SOLVER: { label: 'Проблема', icon: '🔍', color: '#f87171' },
  MENTOR: { label: 'Ментор', icon: '🧠', color: '#a78bfa' },
  MEETING_NOTES: { label: 'Митинг', icon: '📝', color: '#fbbf24' },
  REFLECTION: { label: 'Рефлексия', icon: '💭', color: '#4ade80' },
}

export default function Dashboard() {
  const { stats, fetchStats } = useNotesStore()

  useEffect(() => { fetchStats() }, [])

  const totalByMode = stats?.byMode?.reduce((acc, m) => acc + m._count, 0) || 1

  return (
    <div className="flex flex-col min-h-screen bg-[#080808]">
      <div className="flex-1 overflow-y-auto px-5 pt-14 pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Статистика</h1>
          <p className="text-sm text-[#888] mt-1">Твой прогресс</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-violet-500/8 border border-violet-500/20 rounded-3xl p-4">
            <div className="text-2xl mb-1.5">🎙️</div>
            <div className="text-3xl font-bold text-violet-300 tracking-tight">{stats?.total || 0}</div>
            <div className="text-xs text-[#888] mt-1">Всего заметок</div>
          </div>
          <div className="bg-[#161616] border border-[#1c1c1c] rounded-3xl p-4">
            <div className="text-2xl mb-1.5">⏱️</div>
            <div className="text-3xl font-bold tracking-tight">
              {Math.round((stats?.recentNotes?.reduce((a, n) => a + (n.duration || 0), 0) || 0) / 60)}
            </div>
            <div className="text-xs text-[#888] mt-1">Минут записей</div>
          </div>
          <div className="bg-[#161616] border border-[#1c1c1c] rounded-3xl p-4">
            <div className="text-2xl mb-1.5">📅</div>
            <div className="text-3xl font-bold tracking-tight">{stats?.recentNotes?.length || 0}</div>
            <div className="text-xs text-[#888] mt-1">За последний месяц</div>
          </div>
          <div className="bg-[#161616] border border-[#1c1c1c] rounded-3xl p-4">
            <div className="text-2xl mb-1.5">🔥</div>
            <div className="text-3xl font-bold tracking-tight text-amber-400">—</div>
            <div className="text-xs text-[#888] mt-1">Дней подряд</div>
          </div>
        </div>

        {/* Mode distribution */}
        {stats?.byMode?.length > 0 && (
          <div className="bg-[#161616] border border-[#1c1c1c] rounded-3xl p-5 mb-5">
            <p className="text-xs text-[#555] uppercase tracking-wider mb-4">По режимам</p>
            <div className="flex flex-col gap-3">
              {stats.byMode.map(item => {
                const info = MODE_INFO[item.mode] || { label: item.mode, icon: '📌', color: '#888' }
                const pct = Math.round((item._count / totalByMode) * 100)
                return (
                  <div key={item.mode} className="flex items-center gap-3">
                    <span className="w-20 text-xs text-[#888] flex items-center gap-1">
                      {info.icon} {info.label}
                    </span>
                    <div className="flex-1 h-1.5 bg-[#252525] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: info.color }} />
                    </div>
                    <span className="text-xs text-[#555] w-5 text-right">{item._count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent activity bars */}
        {stats?.recentNotes?.length > 0 && (
          <div className="bg-[#161616] border border-[#1c1c1c] rounded-3xl p-5">
            <p className="text-xs text-[#555] uppercase tracking-wider mb-4">Последние 7 дней</p>
            <div className="flex items-end gap-2 h-20">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - i))
                const dateStr = date.toDateString()
                const count = stats.recentNotes.filter(n => new Date(n.createdAt).toDateString() === dateStr).length
                const height = count ? Math.max(8, count * 20) : 4
                const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{ height: `${height}px`, background: count ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.05)' }}
                    />
                    <span className="text-[9px] text-[#555]">{days[date.getDay()]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!stats && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-[#555] text-sm">Запиши первую заметку<br />и статистика появится здесь</p>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  )
}
