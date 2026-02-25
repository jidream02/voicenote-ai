import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка входа')
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col px-7 py-14">
      <button onClick={() => navigate('/')} className="text-[#888] text-xl mb-8 text-left">←</button>
      <div className="mb-9">
        <h1 className="text-3xl font-bold tracking-tight">С возвращением</h1>
        <p className="text-[#888] text-sm mt-1.5">Войди в свой аккаунт</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <Input label="Пароль" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div className="text-right mb-2">
          <span className="text-sm text-violet-400 cursor-pointer">Забыл пароль?</span>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Входим...' : 'Войти'}
        </Button>
      </form>

      <p className="text-center text-sm text-[#888] mt-6 cursor-pointer" onClick={() => navigate('/register')}>
        Нет аккаунта? <span className="text-violet-400">Зарегистрироваться</span>
      </p>
    </div>
  )
}
