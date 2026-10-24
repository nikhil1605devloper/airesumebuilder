import { Link } from 'react-router-dom'
import useTheme from '../hooks/useTheme'
import ThemeToggle from '../components/ThemeToggle'

function Home() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-black dark:text-white flex flex-col items-center justify-center px-6 transition-colors duration-300">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      <div className="text-center mb-14">
        <p className="text-amber-500 dark:text-amber-400 text-sm tracking-[0.3em] uppercase mb-3">
          AI Powered
        </p>
        <h1 className="text-5xl md:text-6xl font-semibold mb-4">
          Craft the Resume<br />
          <span className="text-amber-500 dark:text-amber-400 italic">That Gets You Hired</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Build a polished resume from scratch, or let AI analyze and improve
          the one you already have.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Link
          to="/builder"
          className="group relative w-72 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-8 backdrop-blur-md hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-xl font-medium mb-2">Build a Resume</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Fill a guided form and let AI write polished, professional content.
          </p>
          <span className="inline-block mt-5 text-amber-500 dark:text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
            Get started →
          </span>
        </Link>

        <Link
          to="/analyzer"
          className="group relative w-72 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-8 backdrop-blur-md hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-medium mb-2">Analyze a Resume</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Upload your existing resume and get an ATS score with feedback.
          </p>
          <span className="inline-block mt-5 text-amber-500 dark:text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
            Upload now →
          </span>
        </Link>

        <Link
          to="/resumes"
          className="group relative w-72 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-8 backdrop-blur-md hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="text-4xl mb-4">🗂️</div>
          <h2 className="text-xl font-medium mb-2">Browse Records</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            View, search, and manage all your saved resume data from the database.
          </p>
          <span className="inline-block mt-5 text-amber-500 dark:text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
            View data →
          </span>
        </Link>
      </div>
    </div>
  )
}

export default Home