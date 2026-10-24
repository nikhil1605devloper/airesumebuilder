import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  fetchPersonalDetails,
  fetchEducations,
  fetchSkills,
  fetchWorkExperiences,
  deletePersonalDetail,
  deleteEducation,
  deleteSkill,
  deleteWorkExperience,
} from '../api/resumes'

// ─── Sub-components ────────────────────────────────────────────────────────────

function TabButton({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-amber-400 text-black'
          : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10'
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
            active ? 'bg-black/20 text-black' : 'bg-amber-400/20 text-amber-600 dark:text-amber-400'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm outline-none focus:border-amber-400/60 transition-colors"
      />
    </div>
  )
}

function DeleteModal({ item, itemLabel, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white dark:bg-[#111118] rounded-2xl border border-black/10 dark:border-white/10 p-8 max-w-sm w-full shadow-2xl"
      >
        <div className="text-3xl mb-4">🗑️</div>
        <h3 className="text-lg font-semibold mb-2">Delete {itemLabel}?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          This action cannot be undone. <span className="font-medium text-black dark:text-white">{item}</span> will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="font-medium text-gray-700 dark:text-gray-300">{title}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  )
}

function Badge({ children, color = 'default' }) {
  const colors = {
    default: 'bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300',
    amber: 'bg-amber-400/10 text-amber-700 dark:text-amber-400',
    green: 'bg-green-500/10 text-green-700 dark:text-green-400',
    blue: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  }
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}

// ─── Tab: Personal Details ────────────────────────────────────────────────────

function PersonalTab({ search }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchPersonalDetails(search ? { search } : {})
      setData(result)
    } catch {
      setError('Failed to load personal details.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deletePersonalDetail(deleteTarget.personal_id)
      setDeleteTarget(null)
      load()
    } catch {
      setError('Failed to delete record.')
      setDeleteTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={load} />
  if (!data.length) return <EmptyState icon="👤" title="No personal details found" subtitle="Create a resume to add personal details." />

  return (
    <>
      <div className="space-y-3">
        {data.map((item, i) => (
          <motion.div
            key={item.personal_id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/2 dark:bg-white/2 hover:border-amber-400/30 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-semibold text-sm">
                {item.full_name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-medium">{item.full_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.email} {item.phone && `· ${item.phone}`}</p>
                {item.professional_summary && (
                  <p className="text-xs text-gray-400 mt-1 max-w-md line-clamp-1">{item.professional_summary}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge color="amber">ID: {item.personal_id}</Badge>
              <button
                onClick={() => setDeleteTarget(item)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors text-sm"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            item={deleteTarget.full_name}
            itemLabel="Personal Details"
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Tab: Education ────────────────────────────────────────────────────────────

const EDU_TYPE_LABELS = {
  'GRADUATION / DEGREE': 'Graduation / Degree',
  '12TH / DIPLOMA': '12th / Diploma',
  '10TH / SCHOOL': '10th / School',
  // fallback for old JS-key values if any exist
  degree: 'Graduation / Degree',
  seniorSecondary: '12th / Diploma',
  school: '10th / School',
}

function EducationTab({ search }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchEducations(search ? { search } : {})
      setData(result)
    } catch {
      setError('Failed to load education records.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteEducation(deleteTarget.education_id)
      setDeleteTarget(null)
      load()
    } catch {
      setError('Failed to delete record.')
      setDeleteTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={load} />
  if (!data.length) return <EmptyState icon="🎓" title="No education records found" subtitle="Education entries are added during resume creation." />

  return (
    <>
      <div className="space-y-3">
        {data.map((item, i) => (
          <motion.div
            key={item.education_id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between p-4 rounded-xl border border-black/10 dark:border-white/10 hover:border-amber-400/30 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-lg">🎓</div>
              <div>
                <p className="font-medium">{item.school_college_name}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge color="blue">{EDU_TYPE_LABELS[item.education_type] || item.education_type}</Badge>
                  {item.board_university && <span className="text-xs text-gray-500">{item.board_university}</span>}
                  {item.year_of_passing && <span className="text-xs text-gray-500">· {item.year_of_passing}</span>}
                  {item.percentage_cgpa && <span className="text-xs text-gray-500">· {item.percentage_cgpa}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge color="amber">ID: {item.education_id}</Badge>
              <button
                onClick={() => setDeleteTarget(item)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors text-sm"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            item={deleteTarget.school_college_name}
            itemLabel="Education Record"
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Tab: Skills ───────────────────────────────────────────────────────────────

function SkillsTab({ search }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchSkills(search ? { search } : {})
      setData(result)
    } catch {
      setError('Failed to load skills.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteSkill(deleteTarget.skill_id)
      setDeleteTarget(null)
      load()
    } catch {
      setError('Failed to delete skill.')
      setDeleteTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={load} />
  if (!data.length) return <EmptyState icon="⚡" title="No skills found" subtitle="Skills are added when you build a resume." />

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {data.map((item, i) => (
          <motion.div
            key={item.skill_id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="group relative flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-amber-400/40 transition-all"
          >
            <span className="text-sm font-medium">{item.skill_name}</span>
            <span className="text-xs text-gray-400">#{item.skill_id}</span>
            <button
              onClick={() => setDeleteTarget(item)}
              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500 text-xs"
              title="Delete skill"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            item={deleteTarget.skill_name}
            itemLabel="Skill"
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Tab: Work Experience ──────────────────────────────────────────────────────

function WorkExperienceTab({ search }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchWorkExperiences(search ? { search } : {})
      setData(result)
    } catch {
      setError('Failed to load work experience.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteWorkExperience(deleteTarget.experience_id)
      setDeleteTarget(null)
      load()
    } catch {
      setError('Failed to delete experience.')
      setDeleteTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={load} />
  if (!data.length) return <EmptyState icon="💼" title="No work experience found" subtitle="Experience entries are added during resume creation." />

  return (
    <>
      <div className="space-y-3">
        {data.map((item, i) => (
          <motion.div
            key={item.experience_id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between p-4 rounded-xl border border-black/10 dark:border-white/10 hover:border-amber-400/30 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-lg">💼</div>
              <div>
                <p className="font-medium">{item.job_title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.company_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {item.start_date && (
                    <span className="text-xs text-gray-400">
                      {item.start_date} {item.end_date ? `→ ${item.end_date}` : '→ Present'}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-gray-400 mt-1 max-w-md line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge color="green">ID: {item.experience_id}</Badge>
              <button
                onClick={() => setDeleteTarget(item)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors text-sm"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            item={`${deleteTarget.job_title} at ${deleteTarget.company_name}`}
            itemLabel="Work Experience"
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Utility Components ────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-amber-400/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 animate-spin" />
      </div>
    </div>
  )
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <p className="text-red-500 font-medium mb-2">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 rounded-lg bg-amber-400 text-black text-sm font-medium hover:bg-amber-300 transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'personal', label: 'Personal Details', placeholder: 'Search by name, email…' },
  { key: 'education', label: 'Education', placeholder: 'Search by school, university…' },
  { key: 'skills', label: 'Skills', placeholder: 'Search skills…' },
  { key: 'experience', label: 'Work Experience', placeholder: 'Search by job title, company…' },
]

function Resumes() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('personal')
  const [search, setSearch] = useState('')
  const [counts, setCounts] = useState({})

  // Fetch counts for tab badges
  useEffect(() => {
    async function loadCounts() {
      try {
        const [personal, edu, skills, exp] = await Promise.allSettled([
          fetchPersonalDetails(),
          fetchEducations(),
          fetchSkills(),
          fetchWorkExperiences(),
        ])
        setCounts({
          personal: personal.status === 'fulfilled' ? personal.value.length : '?',
          education: edu.status === 'fulfilled' ? edu.value.length : '?',
          skills: skills.status === 'fulfilled' ? skills.value.length : '?',
          experience: exp.status === 'fulfilled' ? exp.value.length : '?',
        })
      } catch {
        // silently fail counts
      }
    }
    loadCounts()
  }, [])

  // Reset search when tab changes
  const handleTabChange = (key) => {
    setActiveTab(key)
    setSearch('')
  }

  const currentTab = TABS.find((t) => t.key === activeTab)

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-black dark:text-white px-6 py-14 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors mb-6 flex items-center gap-1"
          >
            ← Back to Home
          </button>
          <p className="text-amber-500 dark:text-amber-400 text-sm tracking-[0.3em] uppercase mb-2">
            Database Records
          </p>
          <h1 className="text-4xl font-semibold">Resume Data</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Browse, search, and manage all records stored in the database.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <TabButton
              key={tab.key}
              label={tab.label}
              active={activeTab === tab.key}
              onClick={() => handleTabChange(tab.key)}
              count={counts[tab.key]}
            />
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={currentTab?.placeholder || 'Search…'}
          />
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'personal' && <PersonalTab search={search} />}
            {activeTab === 'education' && <EducationTab search={search} />}
            {activeTab === 'skills' && <SkillsTab search={search} />}
            {activeTab === 'experience' && <WorkExperienceTab search={search} />}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10 flex justify-center">
          <button
            onClick={() => navigate('/builder')}
            className="px-6 py-3 rounded-lg bg-amber-400 text-black text-sm font-medium hover:bg-amber-300 transition-colors"
          >
            + Build New Resume
          </button>
        </div>

      </div>
    </div>
  )
}

export default Resumes
