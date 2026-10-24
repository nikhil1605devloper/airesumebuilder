import { useFieldArray } from 'react-hook-form'
function EducationLevel({ title, prefix, register, placeholderInstitution, placeholderBoard }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5 space-y-4">
      <h3 className="text-amber-500 dark:text-amber-400 text-sm font-medium uppercase tracking-wide">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">School / College Name</label>
          <input
            {...register(`education.${prefix}.institution`)}
            placeholder={placeholderInstitution}
            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Board / University</label>
          <input
            {...register(`education.${prefix}.board`)}
            placeholder={placeholderBoard}
            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Year of Passing</label>
          <input
            {...register(`education.${prefix}.year`)}
            placeholder="2020"
            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
          />
        </div>
        <div className="col-span-2">
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Percentage / CGPA</label>
          <input
            {...register(`education.${prefix}.grade`)}
            placeholder="85% or 8.5 CGPA"
            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
          />
        </div>
      </div>
    </div>
  )
}

function EducationStep({ register }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-1">Education</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Fill in your academic background, from schooling to your highest degree.
        </p>
      </div>

      <EducationLevel
        title="10th / Schooling"
        prefix="school"
        register={register}
        placeholderInstitution="e.g. St. Xavier's High School"
        placeholderBoard="e.g. Maharashtra State Board"
      />

      <EducationLevel
        title="12th / Diploma"
        prefix="seniorSecondary"
        register={register}
        placeholderInstitution="e.g. City Junior College"
        placeholderBoard="e.g. Maharashtra State Board / Polytechnic Board"
      />

      <EducationLevel
        title="Graduation / Degree"
        prefix="degree"
        register={register}
        placeholderInstitution="e.g. Sanjay Ghodawat University"
        placeholderBoard="e.g. B.Tech in Computer Science"
      />
    </div>
  )
}

export default EducationStep