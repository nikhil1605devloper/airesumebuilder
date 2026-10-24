function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 w-14 h-8 rounded-full border border-white/10 dark:bg-white/10 bg-black/10 flex items-center px-1 transition-colors z-50"
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-6 bg-amber-400' : 'translate-x-0 bg-white'
        }`}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </div>
    </button>
  )
}

export default ThemeToggle