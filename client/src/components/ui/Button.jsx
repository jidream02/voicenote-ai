export default function Button({ children, variant = 'primary', onClick, disabled, className = '', type = 'button' }) {
  const base = 'w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2'
  const variants = {
    primary: 'bg-gradient-to-r from-violet-700 to-violet-400 text-white shadow-lg shadow-violet-700/30 disabled:opacity-50',
    secondary: 'bg-transparent text-[#888] border border-[#252525] hover:border-[#333]',
    ghost: 'bg-[#161616] text-[#888] border border-[#1c1c1c]',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}
