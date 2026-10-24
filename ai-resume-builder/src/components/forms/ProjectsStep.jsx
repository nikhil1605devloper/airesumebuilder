import { useFieldArray } from 'react-hook-form'

function ProjectsStep({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-1">Projects</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Add your projects and highlight the work you have completed.
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

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Project Name <span className="text-red-400">*</span></label>
            <input
              {...register(`projects.${index}.projectName`)}
              placeholder="AI Resume Builder"
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Technologies / Tech Stack</label>
            <input
              {...register(`projects.${index}.techStack`)}
              placeholder="React.js, Django, Python, MySQL, REST API"
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Description</label>
            <textarea
              {...register(`projects.${index}.description`)}
              rows={3}
              placeholder="Developed a web-based AI Resume Builder that collects candidate information..."
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Project URL <span className="text-gray-400 text-xs">(optional)</span></label>
              <input
                {...register(`projects.${index}.projectUrl`)}
                placeholder="https://yourproject.com"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">GitHub URL <span className="text-gray-400 text-xs">(optional)</span></label>
              <input
                {...register(`projects.${index}.githubUrl`)}
                placeholder="https://github.com/your-repo"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ projectName: '', techStack: '', description: '', projectUrl: '', githubUrl: '' })}
        className="w-full py-3 rounded-lg border border-dashed border-black/20 dark:border-white/20 text-sm text-gray-600 dark:text-gray-400 hover:border-amber-400/50 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
      >
        + Add Another Project
      </button>
    </div>
  )
}

export default ProjectsStep
