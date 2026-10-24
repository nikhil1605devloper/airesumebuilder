import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// ─── Resume (nested create) ───────────────────────────────────────────────────

// Maps JS form keys → MySQL ENUM values for education_type column
const EDUCATION_TYPE_MAP = {
  school: '10TH / SCHOOL',
  seniorSecondary: '12TH / DIPLOMA',
  degree: 'GRADUATION / DEGREE',
}

export async function createResume(formData) {
  const payload = {
    resume_title: `${formData.fullName.trim()} Resume`,
    personal_details: {
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || null,
      professional_summary: formData.summary?.trim() || null,
    },
    education: Object.entries(formData.education || {})
      .filter(([, item]) => item.institution?.trim())
      .map(([educationType, item]) => {
        const yearRaw = item.year?.trim()
        const yearInt = yearRaw ? parseInt(yearRaw, 10) : null
        return {
          education_type: EDUCATION_TYPE_MAP[educationType] || educationType,
          school_college_name: item.institution.trim(),
          board_university: item.board?.trim() || null,
          year_of_passing: yearInt && !isNaN(yearInt) ? yearInt : null,
          percentage_cgpa: item.grade?.trim() || null,
        }
      }),
    skills: (formData.skills || [])
      .map((skill) => skill.trim())
      .filter(Boolean)
      .map((skill_name) => ({ skill_name })),
    work_experience: (formData.experience || [])
      .filter((item) => item.title?.trim() && item.company?.trim())
      .map((item) => ({
        job_title: item.title.trim(),
        company_name: item.company.trim(),
        start_date: item.startDate?.trim() || null,
        end_date: item.endDate?.trim() || null,
        description: item.description?.trim() || null,
      })),
  }

  const response = await axios.post(`${API_URL}/resumes/`, payload)
  return response.data
}

// ─── PersonalDetails CRUD ─────────────────────────────────────────────────────

export async function fetchPersonalDetails(params = {}) {
  const response = await axios.get(`${API_URL}/personal/`, { params })
  return response.data
}

export async function fetchPersonalDetailById(id) {
  const response = await axios.get(`${API_URL}/personal/${id}/`)
  return response.data
}

export async function createPersonalDetail(data) {
  const response = await axios.post(`${API_URL}/personal/create/`, data)
  return response.data
}

export async function updatePersonalDetail(id, data) {
  const response = await axios.patch(`${API_URL}/personal/${id}/update/`, data)
  return response.data
}

export async function deletePersonalDetail(id) {
  const response = await axios.delete(`${API_URL}/personal/${id}/delete/`)
  return response.data
}

// ─── ResumeMaster CRUD ────────────────────────────────────────────────────────

export async function fetchResumeMasters(params = {}) {
  const response = await axios.get(`${API_URL}/resume-master/`, { params })
  return response.data
}

export async function fetchResumeMasterById(id) {
  const response = await axios.get(`${API_URL}/resume-master/${id}/`)
  return response.data
}

export async function createResumeMaster(data) {
  const response = await axios.post(`${API_URL}/resume-master/create/`, data)
  return response.data
}

export async function updateResumeMaster(id, data) {
  const response = await axios.patch(`${API_URL}/resume-master/${id}/update/`, data)
  return response.data
}

export async function deleteResumeMaster(id) {
  const response = await axios.delete(`${API_URL}/resume-master/${id}/delete/`)
  return response.data
}

// ─── Education CRUD ───────────────────────────────────────────────────────────

export async function fetchEducations(params = {}) {
  const response = await axios.get(`${API_URL}/education/`, { params })
  return response.data
}

export async function fetchEducationById(id) {
  const response = await axios.get(`${API_URL}/education/${id}/`)
  return response.data
}

export async function createEducation(data) {
  const response = await axios.post(`${API_URL}/education/create/`, data)
  return response.data
}

export async function updateEducation(id, data) {
  const response = await axios.patch(`${API_URL}/education/${id}/update/`, data)
  return response.data
}

export async function deleteEducation(id) {
  const response = await axios.delete(`${API_URL}/education/${id}/delete/`)
  return response.data
}

// ─── Skills CRUD ──────────────────────────────────────────────────────────────

export async function fetchSkills(params = {}) {
  const response = await axios.get(`${API_URL}/skills/`, { params })
  return response.data
}

export async function fetchSkillById(id) {
  const response = await axios.get(`${API_URL}/skills/${id}/`)
  return response.data
}

export async function createSkill(data) {
  const response = await axios.post(`${API_URL}/skills/create/`, data)
  return response.data
}

export async function updateSkill(id, data) {
  const response = await axios.patch(`${API_URL}/skills/${id}/update/`, data)
  return response.data
}

export async function deleteSkill(id) {
  const response = await axios.delete(`${API_URL}/skills/${id}/delete/`)
  return response.data
}

// ─── WorkExperience CRUD ──────────────────────────────────────────────────────

export async function fetchWorkExperiences(params = {}) {
  const response = await axios.get(`${API_URL}/work-experience/`, { params })
  return response.data
}

export async function fetchWorkExperienceById(id) {
  const response = await axios.get(`${API_URL}/work-experience/${id}/`)
  return response.data
}

export async function createWorkExperience(data) {
  const response = await axios.post(`${API_URL}/work-experience/create/`, data)
  return response.data
}

export async function updateWorkExperience(id, data) {
  const response = await axios.patch(`${API_URL}/work-experience/${id}/update/`, data)
  return response.data
}

export async function deleteWorkExperience(id) {
  const response = await axios.delete(`${API_URL}/work-experience/${id}/delete/`)
  return response.data
}

// ─── Project CRUD ─────────────────────────────────────────────────────────────

export async function fetchProjects(params = {}) {
  const response = await axios.get(`${API_URL}/projects/`, { params })
  return response.data
}

export async function createProject(data) {
  const response = await axios.post(`${API_URL}/projects/create/`, data)
  return response.data
}

export async function updateProject(id, data) {
  const response = await axios.patch(`${API_URL}/projects/${id}/update/`, data)
  return response.data
}

export async function deleteProject(id) {
  const response = await axios.delete(`${API_URL}/projects/${id}/delete/`)
  return response.data
}

// ─── Certification CRUD ───────────────────────────────────────────────────────

export async function fetchCertifications(params = {}) {
  const response = await axios.get(`${API_URL}/certifications/`, { params })
  return response.data
}

export async function createCertification(data) {
  const response = await axios.post(`${API_URL}/certifications/create/`, data)
  return response.data
}

export async function updateCertification(id, data) {
  const response = await axios.patch(`${API_URL}/certifications/${id}/update/`, data)
  return response.data
}

export async function deleteCertification(id) {
  const response = await axios.delete(`${API_URL}/certifications/${id}/delete/`)
  return response.data
}

// ─── Achievement CRUD ─────────────────────────────────────────────────────────

export async function fetchAchievements(params = {}) {
  const response = await axios.get(`${API_URL}/achievements/`, { params })
  return response.data
}

export async function createAchievement(data) {
  const response = await axios.post(`${API_URL}/achievements/create/`, data)
  return response.data
}

export async function updateAchievement(id, data) {
  const response = await axios.patch(`${API_URL}/achievements/${id}/update/`, data)
  return response.data
}

export async function deleteAchievement(id) {
  const response = await axios.delete(`${API_URL}/achievements/${id}/delete/`)
  return response.data
}

// ─── Strength CRUD ────────────────────────────────────────────────────────────

export async function fetchStrengths(params = {}) {
  const response = await axios.get(`${API_URL}/strengths/`, { params })
  return response.data
}

export async function createStrength(data) {
  const response = await axios.post(`${API_URL}/strengths/create/`, data)
  return response.data
}

export async function updateStrength(id, data) {
  const response = await axios.patch(`${API_URL}/strengths/${id}/update/`, data)
  return response.data
}

export async function deleteStrength(id) {
  const response = await axios.delete(`${API_URL}/strengths/${id}/delete/`)
  return response.data
}

// ─── Language CRUD ────────────────────────────────────────────────────────────

export async function fetchLanguages(params = {}) {
  const response = await axios.get(`${API_URL}/languages/`, { params })
  return response.data
}

export async function createLanguage(data) {
  const response = await axios.post(`${API_URL}/languages/create/`, data)
  return response.data
}

export async function updateLanguage(id, data) {
  const response = await axios.patch(`${API_URL}/languages/${id}/update/`, data)
  return response.data
}

export async function deleteLanguage(id) {
  const response = await axios.delete(`${API_URL}/languages/${id}/delete/`)
  return response.data
}

// ─── AdditionalDetails ────────────────────────────────────────────────────────

export async function fetchAdditionalDetails(personalId) {
  const response = await axios.get(`${API_URL}/additional-details/`, {
    params: { personal_id: personalId },
  })
  return response.data
}

export async function saveAdditionalDetails(data) {
  const response = await axios.post(`${API_URL}/additional-details/`, data)
  return response.data
}
