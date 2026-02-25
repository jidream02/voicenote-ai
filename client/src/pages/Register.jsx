import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) return setError('Пароль минимум 8 символов')
    try {
      await register(form.email, form.password, form.name)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка регистрации')
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col px-7 py-14">
      <button onClick={() => navigate('/')} className="text-[#888] text-xl mb-8 text-left">←</button>
      <div className="mb-9">
        <h1 className="text-3xl font-bold tracking-tight">Создай аккаунт</h1>
        <p className="text-[#888] text-sm mt-1.5">Начни фиксировать мысли голосом</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Имя" placeholder="Алексей" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <Input label="Пароль" type="password" placeholder="Минимум 8 символов" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading ? 'Создаём...' : 'Создать аккаунт'}
        </Button>
      </form>

      <p className="text-center text-sm text-[#888] mt-6 cursor-pointer" onClick={() => navigate('/login')}>
        Уже есть аккаунт? <span className="text-violet-400">Войти</span>
      </p>
    </div>
  )
}
