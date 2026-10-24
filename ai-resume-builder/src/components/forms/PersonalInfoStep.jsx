function PersonalInfoStep({ register, errors }) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-medium mb-1">Personal Details</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
        Let's start with the basics.
      </p>

      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Full Name</label>
        <input
          {...register('fullName', { required: 'Full name is required' })}
          placeholder="John Doe"
          className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:border-amber-400/60"
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            placeholder="john@email.com"
            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:border-amber-400/60"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Phone</label>
          <input
            {...register('phone', { required: 'Phone is required' })}
            placeholder="+91 XXXXX XXXXX"
            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:border-amber-400/60"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Location</label>
        <input
          {...register('location')}
          placeholder="Kolhapur, Maharashtra, India"
          className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:border-amber-400/60"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">LinkedIn URL</label>
          <input
            {...register('linkedin')}
            placeholder="https://linkedin.com/in/your-profile"
            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:border-amber-400/60"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">GitHub URL</label>
          <input
            {...register('github')}
            placeholder="https://github.com/your-username"
            className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:border-amber-400/60"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Professional Summary</label>
        <textarea
          {...register('summary')}
          rows={4}
          placeholder="A short summary — AI will help polish this later"
          className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:border-amber-400/60 resize-none"
        />
      </div>
    </div>
  )
}

export default PersonalInfoStep