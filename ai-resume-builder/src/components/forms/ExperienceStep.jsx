import { useFieldArray } from 'react-hook-form'

function ExperienceStep({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-1">Work Experience</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Add your past roles — you can add as many as you need.
        </p>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5 space-y-4 relative"
        >
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-sm"
          >
            ✕ Remove
          </button>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Job Title</label>
              <input
                {...register(`experience.${index}.title`)}
                placeholder="Software Engineer"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Company</label>
              <input
                {...register(`experience.${index}.company`)}
                placeholder="Company Name"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Start Date</label>
              <input
                {...register(`experience.${index}.startDate`)}
                placeholder="Jan 2023"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">End Date</label>
              <input
                {...register(`experience.${index}.endDate`)}
                placeholder="Present"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Description</label>
            <textarea
              {...register(`experience.${index}.description`)}
              rows={3}
              placeholder="What did you do in this role? AI will polish this later."
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60 resize-none"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ title: '', company: '', startDate: '', endDate: '', description: '' })}
        className="w-full py-3 rounded-lg border border-dashed border-black/20 dark:border-white/20 text-sm text-gray-600 dark:text-gray-400 hover:border-amber-400/50 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
      >
        + Add Another Job
      </button>
    </div>
  )
}

export default ExperienceStep