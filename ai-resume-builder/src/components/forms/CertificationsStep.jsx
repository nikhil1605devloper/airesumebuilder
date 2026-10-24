import { useFieldArray } from 'react-hook-form'

function CertificationsStep({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications',
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-1">Certifications</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Add certifications and professional courses that strengthen your profile.
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
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Certification Name <span className="text-red-400">*</span></label>
              <input
                {...register(`certifications.${index}.certificationName`)}
                placeholder="Prompt Engineering for Everyone"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Issuing Organization</label>
              <input
                {...register(`certifications.${index}.issuingOrganization`)}
                placeholder="IBM Developer Skills Network"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Issue Date</label>
              <input
                {...register(`certifications.${index}.issueDate`)}
                placeholder="Jun 2026"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Credential URL <span className="text-gray-400 text-xs">(optional)</span></label>
              <input
                {...register(`certifications.${index}.credentialUrl`)}
                placeholder="https://credential.link"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:border-amber-400/60"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ certificationName: '', issuingOrganization: '', issueDate: '', credentialUrl: '' })}
        className="w-full py-3 rounded-lg border border-dashed border-black/20 dark:border-white/20 text-sm text-gray-600 dark:text-gray-400 hover:border-amber-400/50 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
      >
        + Add Another Certification
      </button>
    </div>
  )
}

export default CertificationsStep
