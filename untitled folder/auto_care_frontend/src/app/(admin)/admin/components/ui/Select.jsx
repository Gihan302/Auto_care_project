'use client'

const Select = ({ children, value, onChange, className = '', ...props }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`
        px-3 py-2 border border-gray-300 rounded-lg bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  )
}

export default Select