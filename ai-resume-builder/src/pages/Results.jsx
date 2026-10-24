import { useLocation, useNavigate } from 'react-router-dom'

// Placeholder data — will be replaced with real AI output later
const dummyResults = {
  score: 74,
  strengths: [
    'Clear job titles and company names',
    'Good use of quantifiable metrics in experience',
    'Consistent date formatting',
  ],
  improvements: [
    'Add more industry-specific keywords (e.g. "REST API", "CI/CD")',
    'Professional summary could be more specific to the target role',
    'Consider adding a projects section',
  ],
  missingKeywords: ['Docker', 'AWS', 'Unit Testing', 'Agile'],
}

function ScoreGauge({ score }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeWidth="12" className="text-black/10 dark:text-white/10" />
        <circle
          cx="80" cy="80" r={radius} fill="none"
          stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold">{score}</span>
        <span className="text-xs text-gray-500">ATS Score</span>
      </div>
    </div>
  )
}

function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const fileName = state?.fileName

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-black dark:text-white px-6 py-14 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-10">
          <p className="text-amber-500 dark:text-amber-400 text-sm tracking-[0.3em] uppercase mb-2">
            Analysis Complete
          </p>
          <h1 className="text-3xl font-semibold mb-1">Your Resume Results</h1>
          {fileName && <p className="text-gray-500 text-sm">{fileName}</p>}
        </div>

        <div className="flex justify-center mb-12">
          <ScoreGauge score={dummyResults.score} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6">
            <h2 className="text-green-600 dark:text-green-400 font-medium mb-4 flex items-center gap-2">
              ✅ Strengths
            </h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {dummyResults.strengths.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-green-500">•</span>{s}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6">
            <h2 className="text-amber-600 dark:text-amber-400 font-medium mb-4 flex items-center gap-2">
              ⚠️ Improvements
            </h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {dummyResults.improvements.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-500">•</span>{s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 mb-10">
          <h2 className="font-medium mb-4">🔑 Missing Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {dummyResults.missingKeywords.map((kw) => (
              <span key={kw} className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-sm">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/analyzer')}
            className="px-6 py-3 rounded-lg border border-black/10 dark:border-white/10 text-sm"
          >
            ← Try Another Resume
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg bg-amber-400 text-black text-sm font-medium hover:bg-amber-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Results