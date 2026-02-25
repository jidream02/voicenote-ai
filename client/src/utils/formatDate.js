export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / 86400000)

  if (days === 0) return 'сегодня'
  if (days === 1) return 'вчера'
  if (days < 7) return `${days} дн. назад`
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export const formatDuration = (seconds) => {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const MODE_LABELS = {
  ROADMAP: { label: 'Роадмап', icon: '🗺️', color: 'blue' },
  PROBLEM_SOLVER: { label: 'Проблема', icon: '🔍', color: 'red' },
  MENTOR: { label: 'Ментор', icon: '🧠', color: 'purple' },
  MEETING_NOTES: { label: 'Митинг', icon: '📝', color: 'amber' },
  REFLECTION: { label: 'Рефлексия', icon: '💭', color: 'green' },
}

export const MODE_COLORS = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  purple: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
}
