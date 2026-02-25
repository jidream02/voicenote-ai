import { useNavigate } from 'react-router-dom'
import ModeBadge from './ui/Badge'
import { formatDate, formatDuration } from '../utils/formatDate'

export default function NoteCard({ note }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/note/${note.id}`)}
      className="bg-[#161616] border border-[#1c1c1c] rounded-3xl p-4 cursor-pointer hover:border-[#252525] transition-colors active:scale-[0.99]"
    >
      <div className="flex items-center justify-between mb-2.5">
        <ModeBadge mode={note.mode} />
        <span className="text-xs text-[#555] font-mono">{formatDuration(note.duration)}</span>
      </div>
      <h3 className="text-[15px] font-semibold leading-snug mb-1.5 line-clamp-2">{note.title}</h3>
      {note.transcript && (
        <p className="text-sm text-[#888] leading-relaxed line-clamp-2">{note.transcript}</p>
      )}
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-1.5 flex-wrap">
          {note.tags?.slice(0, 3).map(tag => (
            <span key={tag.id} className="text-[11px] text-[#555] bg-[#101010] px-2 py-0.5 rounded-lg">{tag.name}</span>
          ))}
        </div>
        <span className="text-[11px] text-[#555]">{formatDate(note.createdAt)}</span>
      </div>
    </div>
  )
}
