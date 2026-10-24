import { useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'

// ─── Tag-style input (reused for Strengths) ────────────────────────────────────

function TagInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState('')

  const add = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  const remove = (item) => {
    onChange(value.filter((s) => s !== item))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((item) => (
          <span
            key={item}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30 text-sm"
          >
            {item}
            <button type="button" onClick={() => remove(item)} className="hover:text-red-500">
              ✕
            </button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:border-amber-400/60"
      />
      <p className="text-xs text-gray-500 mt-2">Press Enter or comma to add</p>
    </div>
  )
}

// ─── AdditionalDetailsStep ────────────────────────────────────────────────────

function AdditionalDetailsStep({ control, register }) {
  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control,
    name: 'achievements',
  })

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control,
    name: 'languages',
  })

  const AVAILABILITY_OPTIONS = [
    'Immediate Joiner',
    '15 Days Notice',
    '30 Days Notice',
    '60 Days Notice',
    'Other',
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium mb-1">Additional Details</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Add additional information to complete your resume.
        </p>
      </div>

      {/* Strengths */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5 space-y-3">
        <h3 className="text-amber-500 dark:text-amber-400 text-sm font-medium uppercase tracking-wide">Strengths</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Type a strength and press Enter.</p>
        <Controller
          name="strengths"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              placeholder="e.g. Problem Solving, Team Leadership..."
            />
          )}
        />
      </div>

      {/* Languages */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5 space-y-4">
        <h3 className="text-amber-500 dark:text-amber-400 text-sm font-medium uppercase tracking-wide">Languages</h3>

        {languageFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-2 gap-4 relative">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Language</label>
              <input
                {...register(`languages.${index}.languageName`)}
                placeholder="English"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
              />
            </div>
            <div className="relative">
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Proficiency</label>
              <div className="flex gap-2">
                <input
                  {...register(`languages.${index}.proficiency`)}
                  placeholder="Professional"
                  className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
                />
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="px-3 py-2 text-gray-500 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => appendLanguage({ languageName: '', proficiency: '' })}
          className="w-full py-3 rounded-lg border border-dashed border-black/20 dark:border-white/20 text-sm text-gray-600 dark:text-gray-400 hover:border-amber-400/50 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
        >
          + Add Language
        </button>
      </div>

      {/* Availability */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5 space-y-3">
        <h3 className="text-amber-500 dark:text-amber-400 text-sm font-medium uppercase tracking-wide">Availability</h3>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Notice Period / Availability</label>
          <select
            {...register('availability')}
            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:border-amber-400/60"
          >
            <option value="">Select availability...</option>
            {AVAILABILITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Custom (if Other)</label>
          <input
            {...register('availabilityCustom')}
            placeholder="e.g. 45 Days Notice"
            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:border-amber-400/60"
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5 space-y-4">
        <h3 className="text-amber-500 dark:text-amber-400 text-sm font-medium uppercase tracking-wide">Achievements</h3>

        {achievementFields.map((field, index) => (
          <div key={field.id} className="flex gap-3 items-start">
            <input
              {...register(`achievements.${index}.description`)}
              placeholder="e.g. Volunteer at Art of Living"
              className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
            />
            <button
              type="button"
              onClick={() => removeAchievement(index)}
              className="mt-3 text-gray-500 hover:text-red-500 text-sm flex-shrink-0"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => appendAchievement({ description: '' })}
          className="w-full py-3 rounded-lg border border-dashed border-black/20 dark:border-white/20 text-sm text-gray-600 dark:text-gray-400 hover:border-amber-400/50 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
        >
          + Add Achievement
        </button>
      </div>
    </div>
  )
}

export default AdditionalDetailsStep
