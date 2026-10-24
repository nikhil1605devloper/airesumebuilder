import { useState } from 'react'
import { Controller } from 'react-hook-form'

function SkillsInput({ value = [], onChange }) {
  const [input, setInput] = useState('')

  const addSkill = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  const removeSkill = (skill) => {
    onChange(value.filter((s) => s !== skill))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30 text-sm"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="hover:text-red-500"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a skill and press Enter (e.g. React, Django, MySQL)"
        className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:border-amber-400/60"
      />
      <p className="text-xs text-gray-500 mt-2">Press Enter or comma after each skill</p>
    </div>
  )
}

function SkillsStep({ control }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-1">Skills</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Add your technical and soft skills — as many as relevant.
        </p>
      </div>

      <Controller
        name="skills"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <SkillsInput value={field.value} onChange={field.onChange} />
        )}
      />
    </div>
  )
}

export default SkillsStep