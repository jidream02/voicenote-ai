export default function Input({ label, type = 'text', placeholder, value, onChange, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs text-[#888] uppercase tracking-wider font-medium">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-[#161616] border border-[#252525] rounded-2xl px-4 py-3.5 text-[#f0f0f0] text-sm font-['DM_Sans'] placeholder-[#555] focus:outline-none focus:border-violet-500 transition-colors"
      />
    </div>
  )
}
