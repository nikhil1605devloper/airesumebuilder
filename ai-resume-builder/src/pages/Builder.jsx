import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import PersonalInfoStep from '../components/forms/PersonalInfoStep'
import ExperienceStep from '../components/forms/ExperienceStep'
import ProjectsStep from '../components/forms/ProjectsStep'
import EducationStep from '../components/forms/EducationStep'
import CertificationsStep from '../components/forms/CertificationsStep'
import SkillsStep from '../components/forms/SkillsStep'
import AdditionalDetailsStep from '../components/forms/AdditionalDetailsStep'
import { useNavigate } from 'react-router-dom'
import {
  createPersonalDetail,
  createWorkExperience,
  createProject,
  createEducation,
  createCertification,
  createSkill,
  createStrength,
  createLanguage,
  createAchievement,
  saveAdditionalDetails,
} from '../api/resumes'

// Steps config
const steps = ['Personal', 'Experience', 'Projects', 'Education', 'Certifications', 'Skills', 'Additional']

// Maps JS form keys → MySQL ENUM values for education_type column
const EDUCATION_TYPE_MAP = {
  school: '10TH / SCHOOL',
  seniorSecondary: '12TH / DIPLOMA',
  degree: 'GRADUATION / DEGREE',
}

function Builder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [personalId, setPersonalId] = useState(null)
  const navigate = useNavigate()
  const { register, control, handleSubmit, watch, trigger, getValues, formState: { errors } } = useForm()

  const skillsValue = watch('skills')
  const hasSkills = skillsValue && skillsValue.length > 0

  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter' && currentStep < steps.length - 1) {
      e.preventDefault()
    }
  }

  // Save current step data to the backend and advance
  const handleContinue = async () => {
    setSaveError('')
    const data = getValues()

    try {
      setIsSaving(true)

      if (currentStep === 0) {
        // Personal Details
        const personalPayload = {
          full_name: data.fullName?.trim(),
          email: data.email?.trim(),
          phone: data.phone?.trim() || null,
          location: data.location?.trim() || null,
          linkedin_url: data.linkedin?.trim() || null,
          github_url: data.github?.trim() || null,
          professional_summary: data.summary?.trim() || null,
        }
        if (!personalPayload.full_name) { setSaveError('Full name is required.'); return }
        if (!personalPayload.email) { setSaveError('Email is required.'); return }

        const saved = await createPersonalDetail(personalPayload)
        setPersonalId(saved.personal_id)

      } else if (currentStep === 1) {
        // Work Experience
        if (personalId && data.experience?.length) {
          for (const exp of data.experience) {
            if (exp.title?.trim() && exp.company?.trim()) {
              await createWorkExperience({
                personal: personalId,
                job_title: exp.title.trim(),
                company_name: exp.company.trim(),
                start_date: exp.startDate?.trim() || null,
                end_date: exp.endDate?.trim() || null,
                description: exp.description?.trim() || null,
              })
            }
          }
        }

      } else if (currentStep === 2) {
        // Projects
        if (personalId && data.projects?.length) {
          for (const proj of data.projects) {
            if (proj.projectName?.trim()) {
              await createProject({
                personal: personalId,
                project_name: proj.projectName.trim(),
                tech_stack: proj.techStack?.trim() || null,
                description: proj.description?.trim() || null,
                project_url: proj.projectUrl?.trim() || null,
                github_url: proj.githubUrl?.trim() || null,
              })
            }
          }
        }

      } else if (currentStep === 3) {
        // Education
        if (personalId && data.education) {
          for (const [educationType, item] of Object.entries(data.education)) {
            if (item.institution?.trim()) {
              const yearRaw = item.year?.trim()
              const yearInt = yearRaw ? parseInt(yearRaw, 10) : null
              await createEducation({
                personal: personalId,
                education_type: EDUCATION_TYPE_MAP[educationType] || educationType,
                school_college_name: item.institution.trim(),
                board_university: item.board?.trim() || null,
                year_of_passing: yearInt && !isNaN(yearInt) ? yearInt : null,
                percentage_cgpa: item.grade?.trim() || null,
              })
            }
          }
        }

      } else if (currentStep === 4) {
        // Certifications
        if (personalId && data.certifications?.length) {
          for (const cert of data.certifications) {
            if (cert.certificationName?.trim()) {
              await createCertification({
                personal: personalId,
                certification_name: cert.certificationName.trim(),
                issuing_organization: cert.issuingOrganization?.trim() || null,
                issue_date: cert.issueDate?.trim() || null,
                credential_url: cert.credentialUrl?.trim() || null,
              })
            }
          }
        }

      } else if (currentStep === 5) {
        // Skills — validate at least one skill
        if (!hasSkills) {
          setSaveError('Add at least one skill before continuing.')
          return
        }
        if (personalId && data.skills?.length) {
          for (const skillName of data.skills) {
            if (skillName?.trim()) {
              await createSkill({
                personal: personalId,
                skill_name: skillName.trim(),
              })
            }
          }
        }
      }
      // Step 6 (Additional Details) is saved on final submit

      setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
    } catch (error) {
      const responseData = error.response?.data
      const message = responseData?.error || responseData?.message
        || (responseData ? Object.entries(responseData).map(([f, d]) => `${f}: ${typeof d === 'string' ? d : JSON.stringify(d)}`).join(' | ') : null)
        || error.message
      setSaveError(message || 'Failed to save. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const prevStep = () => {
    setSaveError('')
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  const onSubmit = async (data) => {
    setIsSaving(true)
    setSaveError('')
    try {
      if (!hasSkills) {
        setSaveError('Add at least one skill before generating.')
        return
      }

      // Save Additional Details
      if (personalId) {
        const availabilityValue = data.availabilityCustom?.trim() || data.availability || null

        if (availabilityValue) {
          await saveAdditionalDetails({
            personal: personalId,
            availability: availabilityValue,
          })
        }

        // Save Strengths
        if (data.strengths?.length) {
          for (const s of data.strengths) {
            if (s?.trim()) {
              await createStrength({ personal: personalId, strength_name: s.trim() })
            }
          }
        }

        // Save Languages
        if (data.languages?.length) {
          for (const lang of data.languages) {
            if (lang.languageName?.trim()) {
              await createLanguage({
                personal: personalId,
                language_name: lang.languageName.trim(),
                proficiency: lang.proficiency?.trim() || null,
              })
            }
          }
        }

        // Save Achievements
        if (data.achievements?.length) {
          for (const ach of data.achievements) {
            if (ach.description?.trim()) {
              await createAchievement({
                personal: personalId,
                description: ach.description.trim(),
              })
            }
          }
        }
      }

      navigate('/preview', {
        state: {
          resumeData: data,
          personalId,
        },
      })
    } catch (error) {
      const responseData = error.response?.data
      const message = responseData?.error || responseData?.message
        || (responseData ? Object.entries(responseData).map(([f, d]) => `${f}: ${typeof d === 'string' ? d : JSON.stringify(d)}`).join(' | ') : null)
        || error.message
      setSaveError(message || 'Unable to save your resume. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-black dark:text-white px-6 py-14 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    i <= currentStep
                      ? 'bg-amber-400 text-black'
                      : 'bg-black/10 dark:bg-white/10 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                <p className={`text-xs mt-2 text-center leading-tight ${i === currentStep ? 'text-amber-500 dark:text-amber-400' : 'text-gray-500'}`}>
                  {label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px flex-1 mb-5 ${i < currentStep ? 'bg-amber-400' : 'bg-black/10 dark:bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {currentStep === 0 && <PersonalInfoStep register={register} errors={errors} />}
              {currentStep === 1 && <ExperienceStep control={control} register={register} />}
              {currentStep === 2 && <ProjectsStep control={control} register={register} />}
              {currentStep === 3 && <EducationStep register={register} />}
              {currentStep === 4 && <CertificationsStep control={control} register={register} />}
              {currentStep === 5 && <SkillsStep control={control} />}
              {currentStep === 6 && <AdditionalDetailsStep control={control} register={register} />}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-start mt-10">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0 || isSaving}
              className="px-6 py-3 rounded-lg border border-black/10 dark:border-white/10 text-sm disabled:opacity-30"
            >
              ← Back
            </button>

            {!isLastStep ? (
              <button
                type="button"
                onClick={handleContinue}
                disabled={isSaving}
                className="px-6 py-3 rounded-lg bg-amber-400 text-black text-sm font-medium hover:bg-amber-300 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Continue →'}
              </button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                <button
                  type="submit"
                  disabled={!hasSkills || isSaving}
                  className="px-6 py-3 rounded-lg bg-amber-400 text-black text-sm font-medium hover:bg-amber-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving Resume...' : 'Generate Resume ✨'}
                </button>
                {!hasSkills && (
                  <p className="text-xs text-red-500">Add at least one skill first</p>
                )}
              </div>
            )}
          </div>

          {saveError && (
            <p role="alert" className="mt-4 text-right text-sm text-red-500">
              {saveError}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Builder