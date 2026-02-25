import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { useNotesStore } from '../store/notesStore'
import { uploadAudio } from '../api/notes'
import Navbar from '../components/Navbar'

const MODES = [
  { id: 'ROADMAP', icon: '🗺️', label: 'Роадмап' },
  { id: 'PROBLEM_SOLVER', icon: '🔍', label: 'Проблема' },
  { id: 'MENTOR', icon: '🧠', label: 'Ментор' },
  { id: 'MEETING_NOTES', icon: '📝', label: 'Митинг' },
  { id: 'REFLECTION', icon: '💭', label: 'Рефлексия' },
]

export default function Record() {
  const navigate = useNavigate()
  const { addNote } = useNotesStore()
  const { isRecording, duration, audioBlob, audioUrl, start, stop, reset, formatDuration } = useAudioRecorder()
  const [selectedMode, setSelectedMode] = useState('ROADMAP')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const handleProcess = async () => {
    if (!audioBlob) return
    setIsProcessing(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('mode', selectedMode)
      formData.append('duration', String(duration))

      const { data } = await uploadAudio(formData, setProgress)
      addNote(data.note)
      navigate(`/note/${data.note.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка обработки')
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#080808]">
      <div className="flex-1 px-7 pt-14 pb-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/home')} className="text-[#888] text-xl">←</button>
          <h1 className="text-xl font-bold">Новая запись</h1>
        </div>

        {/* Mode selector */}
        {!audioBlob && (
          <div className="mb-8">
            <p className="text-xs text-[#888] uppercase tracking-wider mb-3">Режим анализа</p>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMode(m.id)}
                  className={`rounded-2xl py-3 px-2 text-center border transition-all ${
                    selectedMode === m.id
                      ? 'bg-violet-700/20 border-violet-500'
                      : 'bg-[#161616] border-[#1c1c1c]'
                  }`}
                >
                  <div className="text-2xl mb-1">{m.icon}</div>
                  <div className="text-[11px] text-[#888]">{m.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recorder */}
        <div className="flex flex-col items-center">
          {!audioBlob ? (
            <>
              <div
                onClick={isRecording ? stop : start}
                className={`w-40 h-40 rounded-full flex items-center justify-center cursor-pointer border transition-all mb-4 ${
                  isRecording
                    ? 'pulse-ring border-violet-400/60 bg-violet-500/20'
                    : 'border-violet-500/20 bg-violet-500/10 hover:bg-violet-500/15'
                }`}
              >
                <span className="text-5xl">{isRecording ? '⏹️' : '🎙️'}</span>
              </div>

              <div className="text-4xl font-light font-mono text-violet-300 tracking-tight mb-2">
                {formatDuration(duration)}
              </div>

              {isRecording && (
                <div className="flex items-end gap-[3px] h-10 my-2">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.06}s` }} />
                  ))}
                </div>
              )}

              <p className="text-xs text-[#555] text-center mt-2">
                {isRecording ? 'Нажми чтобы остановить' : 'Нажми чтобы начать запись'}
              </p>
            </>
          ) : (
            /* Post-recording */
            <div className="w-full fade-in">
              <div className="text-center mb-6">
                <p className="text-4xl mb-2">✅</p>
                <p className="font-semibold text-lg">Запись готова</p>
                <p className="text-[#888] text-sm">{formatDuration(duration)} · {MODES.find(m => m.id === selectedMode)?.label}</p>
              </div>

              <audio src={audioUrl} controls className="w-full mb-6 rounded-xl" />

              {isProcessing ? (
                <div className="text-center">
                  <div className="text-3xl mb-3">🤖</div>
                  <p className="text-[#888] text-sm mb-2">AI обрабатывает запись...</p>
                  <div className="h-1.5 bg-[#161616] rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 transition-all duration-300 rounded-full" style={{ width: `${progress || 10}%` }} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <button
                    onClick={handleProcess}
                    className="w-full py-4 rounded-2xl font-semibold text-base text-white"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
                  >
                    🤖 Обработать с AI
                  </button>
                  <button onClick={reset} className="w-full py-3.5 rounded-2xl text-[#888] text-sm border border-[#1c1c1c] bg-[#161616]">
                    Записать заново
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  )
}
