import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMessages, sendMessage } from '../api/chat'
import { getNote } from '../api/notes'

export default function Chat() {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [note, setNote] = useState(null)
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      const [msgsRes, noteRes] = await Promise.all([getMessages(noteId), getNote(noteId)])
      setMessages(msgsRes.data.messages)
      setNote(noteRes.data.note)
      if (msgsRes.data.messages.length === 0) {
        // Auto greeting
        setMessages([{ id: 'greeting', role: 'assistant', content: `Я изучил твою заметку "${noteRes.data.note.title}". Задай любой вопрос или попроси помочь с чем-то конкретным!`, createdAt: new Date().toISOString() }])
      }
    }
    load()
  }, [noteId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isSending) return
    const userMsg = { id: Date.now(), role: 'user', content: input, createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsSending(true)
    try {
      const { data } = await sendMessage(noteId, input)
      setMessages(prev => [...prev, data.message])
    } catch {
      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: 'Ошибка. Попробуй ещё раз.', createdAt: new Date().toISOString() }])
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (str) => new Date(str).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col h-screen bg-[#080808]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4 border-b border-[#1c1c1c]">
        <button onClick={() => navigate(`/note/${noteId}`)} className="text-[#888] text-xl">←</button>
        <div className="flex-1">
          <p className="font-bold text-base line-clamp-1">{note?.title || 'Заметка'}</p>
          <p className="text-xs text-[#888]">AI анализирует твою запись</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 flex items-center gap-1">🤖 AI</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[80%] flex flex-col gap-1">
              <div className={`px-3.5 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-violet-700 text-white rounded-br-sm'
                  : 'bg-[#161616] border border-[#1c1c1c] text-[#f0f0f0] rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
              <span className={`text-[10px] text-[#555] ${msg.role === 'user' ? 'text-right' : ''}`}>
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-[#161616] border border-[#1c1c1c] px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-3 pb-8 border-t border-[#1c1c1c] bg-[#080808] flex gap-2.5 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Спроси что-то о заметке..."
          rows={1}
          className="flex-1 bg-[#161616] border border-[#252525] rounded-2xl px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#555] resize-none focus:outline-none focus:border-violet-500 max-h-28 font-['DM_Sans']"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg disabled:opacity-40 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
