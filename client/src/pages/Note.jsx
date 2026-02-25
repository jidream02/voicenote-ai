import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNotesStore } from '../store/notesStore'
import ModeBadge from '../components/ui/Badge'
import { formatDate, formatDuration } from '../utils/formatDate'
import Navbar from '../components/Navbar'

function RenderAIResult({ mode, result }) {
  if (!result) return null

  if (mode === 'ROADMAP') return (
    <div className="flex flex-col gap-4">
      {result.summary && <p className="text-sm text-[#888] leading-relaxed">{result.summary}</p>}
      {result.phases?.map((phase, i) => (
        <div key={i} className="bg-[#161616] border border-[#1c1c1c] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-violet-700 flex items-center justify-center text-xs font-bold">{i + 1}</div>
            <span className="font-semibold text-sm">{phase.name}</span>
            {phase.duration && <span className="text-xs text-[#555] ml-auto">{phase.duration}</span>}
          </div>
          <div className="flex flex-col gap-1.5 pl-8">
            {phase.steps?.map((step, j) => (
              <p key={j} className="text-xs text-[#888] flex gap-2">
                <span className="text-violet-400 text-base leading-none">·</span>{step}
              </p>
            ))}
          </div>
        </div>
      ))}
      {result.keyInsights?.length > 0 && (
        <div className="bg-violet-500/5 border border-violet-500/15 rounded-2xl p-4">
          <p className="text-xs text-violet-300 font-semibold mb-2">💡 Ключевые инсайты</p>
          {result.keyInsights.map((insight, i) => (
            <p key={i} className="text-sm text-[#888] mb-1">• {insight}</p>
          ))}
        </div>
      )}
    </div>
  )

  if (mode === 'PROBLEM_SOLVER') return (
    <div className="flex flex-col gap-3">
      {result.problem && <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-4"><p className="text-xs text-red-400 font-semibold mb-1">Проблема</p><p className="text-sm text-[#888]">{result.problem}</p></div>}
      {result.rootCauses?.length > 0 && (
        <div className="bg-[#161616] border border-[#1c1c1c] rounded-2xl p-4">
          <p className="text-xs text-[#888] font-semibold mb-2">Корневые причины</p>
          {result.rootCauses.map((c, i) => <p key={i} className="text-sm text-[#888] mb-1">• {c}</p>)}
        </div>
      )}
      {result.solutions?.map((sol, i) => (
        <div key={i} className="bg-[#161616] border border-[#1c1c1c] rounded-2xl p-4">
          <p className="font-semibold text-sm mb-1">{sol.title}</p>
          <p className="text-xs text-[#888]">{sol.description}</p>
        </div>
      ))}
      {result.nextStep && <div className="bg-green-500/5 border border-green-500/15 rounded-2xl p-4"><p className="text-xs text-green-400 font-semibold mb-1">Следующий шаг</p><p className="text-sm text-[#888]">{result.nextStep}</p></div>}
    </div>
  )

  if (mode === 'MENTOR') return (
    <div className="flex flex-col gap-3">
      {result.summary && <p className="text-sm text-[#888] leading-relaxed">{result.summary}</p>}
      {result.advice?.length > 0 && (
        <div className="bg-violet-500/5 border border-violet-500/15 rounded-2xl p-4">
          <p className="text-xs text-violet-300 font-semibold mb-2">Советы ментора</p>
          {result.advice.map((a, i) => <p key={i} className="text-sm text-[#888] mb-1.5">• {a}</p>)}
        </div>
      )}
      {result.questions?.length > 0 && (
        <div className="bg-[#161616] border border-[#1c1c1c] rounded-2xl p-4">
          <p className="text-xs text-[#888] font-semibold mb-2">Вопросы для размышления</p>
          {result.questions.map((q, i) => <p key={i} className="text-sm text-[#888] mb-1.5 italic">"{q}"</p>)}
        </div>
      )}
      {result.encouragement && <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4"><p className="text-sm text-[#888]">{result.encouragement}</p></div>}
    </div>
  )

  if (mode === 'REFLECTION') return (
    <div className="flex flex-col gap-3">
      {result.mood && <div className="bg-[#161616] border border-[#1c1c1c] rounded-2xl p-4 flex items-center gap-3"><span className="text-2xl">🌡️</span><div><p className="text-xs text-[#555]">Настроение</p><p className="font-semibold text-sm">{result.mood}</p></div></div>}
      {result.insights?.length > 0 && (
        <div className="bg-violet-500/5 border border-violet-500/15 rounded-2xl p-4">
          <p className="text-xs text-violet-300 font-semibold mb-2">Инсайты</p>
          {result.insights.map((ins, i) => <p key={i} className="text-sm text-[#888] mb-1">• {ins}</p>)}
        </div>
      )}
      {result.tomorrowFocus && <div className="bg-green-500/5 border border-green-500/15 rounded-2xl p-4"><p className="text-xs text-green-400 font-semibold mb-1">Фокус на завтра</p><p className="text-sm text-[#888]">{result.tomorrowFocus}</p></div>}
    </div>
  )

  // Fallback - generic
  return <pre className="text-xs text-[#888] whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
}

export default function Note() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentNote: note, isLoading, fetchNote, deleteNote } = useNotesStore()

  useEffect(() => { fetchNote(id) }, [id])

  const handleDelete = async () => {
    if (!confirm('Удалить заметку?')) return
    await deleteNote(id)
    navigate('/home')
  }

  if (isLoading || !note) return (
    <div className="flex items-center justify-center min-h-screen bg-[#080808]">
      <p className="text-[#555] text-sm">Загрузка...</p>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-[#080808]">
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Header */}
        <div className="px-5 pt-14 pb-4 border-b border-[#1c1c1c]">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/home')} className="text-[#888] text-base">←</button>
            <span className="text-xs text-[#555]">Заметки</span>
          </div>
          <h1 className="text-xl font-bold leading-snug mb-3">{note.title}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <ModeBadge mode={note.mode} />
            <span className="text-xs text-[#555]">{formatDuration(note.duration)} · {formatDate(note.createdAt)}</span>
          </div>
        </div>

        {/* Audio player */}
        {note.audioUrl && (
          <div className="mx-5 mt-4 bg-[#161616] border border-[#1c1c1c] rounded-2xl p-4">
            <audio src={`http://localhost:5000${note.audioUrl}`} controls className="w-full" />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2.5 px-5 mt-3">
          <button onClick={() => navigate(`/chat/${note.id}`)}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold text-violet-300 border border-violet-500/30 bg-violet-500/10 flex items-center justify-center gap-1.5">
            💬 Чат с AI
          </button>
          <button onClick={handleDelete}
            className="px-4 py-3 rounded-2xl text-sm text-red-400 border border-red-500/20 bg-red-500/5">
            🗑️
          </button>
        </div>

        {/* Transcript */}
        {note.transcript && (
          <div className="px-5 mt-5">
            <p className="text-xs text-[#555] uppercase tracking-wider mb-2.5">📝 Транскрипт</p>
            <p className="text-sm text-[#888] leading-relaxed">{note.transcript}</p>
          </div>
        )}

        {/* AI Result */}
        {note.aiResult && (
          <div className="px-5 mt-5">
            <p className="text-xs text-[#555] uppercase tracking-wider mb-3">🤖 AI Анализ</p>
            <RenderAIResult mode={note.mode} result={note.aiResult} />
          </div>
        )}

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="px-5 mt-5 flex flex-wrap gap-2">
            {note.tags.map(tag => (
              <span key={tag.id} className="text-xs text-[#555] bg-[#161616] border border-[#1c1c1c] px-2.5 py-1 rounded-full">{tag.name}</span>
            ))}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  )
}
