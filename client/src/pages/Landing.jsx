import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

const FEATURES = [
  { icon: '🗺️', title: 'Роадмап', desc: 'Опиши цель — получи план' },
  { icon: '🔍', title: 'Решение проблем', desc: 'AI найдёт причины и выходы' },
  { icon: '🧠', title: 'AI Ментор', desc: 'Диалог, советы, обратная связь' },
]

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col px-7 pb-10 pt-16"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, #080808 60%)' }}>
      {/* Hero */}
      <div className="flex flex-col items-center text-center py-10">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-7"
          style={{ background: 'radial-gradient(circle at 35% 35%, #c4b5fd, #7c3aed, #4c1d95)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
          🎙️
        </div>
        <h1 className="text-[34px] font-bold leading-[1.1] tracking-tight mb-3">
          Говори.<br />
          <span style={{ background: 'linear-gradient(135deg, #c4b5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI слушает.
          </span>
        </h1>
        <p className="text-[#888] text-[15px] leading-relaxed">
          Превращай голосовые заметки в структурированные планы, решения и инсайты
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-3 mb-10">
        {FEATURES.map(f => (
          <div key={f.title} className="flex items-center gap-3 bg-[#161616] border border-[#1c1c1c] rounded-2xl px-4 py-3.5">
            <span className="text-2xl">{f.icon}</span>
            <div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-xs text-[#888]">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-3 mt-auto">
        <Button onClick={() => navigate('/register')}>Начать бесплатно</Button>
        <Button variant="secondary" onClick={() => navigate('/login')}>Уже есть аккаунт</Button>
      </div>
    </div>
  )
}
