import { MODE_LABELS, MODE_COLORS } from '../../utils/formatDate'

export default function ModeBadge({ mode }) {
  const m = MODE_LABELS[mode] || { label: mode, icon: '📌', color: 'purple' }
  const colorClass = MODE_COLORS[m.color]
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${colorClass}`}>
      {m.icon} {m.label}
    </span>
  )
}
