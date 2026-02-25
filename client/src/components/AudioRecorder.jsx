import { useAudioRecorder } from '../hooks/useAudioRecorder'

export default function AudioRecorder({ onStop }) {
  const { isRecording, duration, audioUrl, start, stop, reset, formatDuration } = useAudioRecorder()

  const handleStop = () => {
    stop()
    // audioBlob will be available after stop via the hook
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Orb */}
      <div
        onClick={isRecording ? handleStop : start}
        className={`w-40 h-40 rounded-full flex items-center justify-center cursor-pointer border transition-all
          ${isRecording
            ? 'pulse-ring border-violet-400/60 bg-violet-500/20'
            : 'border-violet-500/20 bg-violet-500/10'
          }`}
      >
        <span className="text-5xl">{isRecording ? '⏹️' : '🎙️'}</span>
      </div>

      {/* Timer */}
      <div className="text-4xl font-light font-mono text-violet-300 tracking-tight">
        {formatDuration(duration)}
      </div>

      {/* Waveform */}
      {isRecording && (
        <div className="flex items-end gap-[3px] h-10">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      )}

      {/* Audio playback after recording */}
      {audioUrl && !isRecording && (
        <audio src={audioUrl} controls className="w-full mt-2" />
      )}

      <p className="text-xs text-[#555] text-center">
        {isRecording ? 'Нажми чтобы остановить' : audioUrl ? 'Запись готова' : 'Нажми чтобы начать запись'}
      </p>
    </div>
  )
}
