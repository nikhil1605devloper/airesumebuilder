import { useLocation, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'

function Preview() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const data = state?.resumeData
  const resumeRef = useRef(null)

  if (!data) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-black dark:text-white flex flex-col items-center justify-center px-6">
        <p className="text-gray-500 mb-4">No resume data found.</p>
        <button
          onClick={() => navigate('/builder')}
          className="px-6 py-3 rounded-lg bg-amber-400 text-black text-sm font-medium"
        >
          Go back to Builder
        </button>
      </div>
    )
  }

  const handleDownloadPDF = async () => {
    const element = resumeRef.current
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${data.fullName || 'resume'}.pdf`)
  }

  // Compute availability display
  const availabilityDisplay = data.availabilityCustom?.trim() || data.availability || null

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0f] text-black dark:text-white px-6 py-14 transition-colors duration-300">
      <div
        ref={resumeRef}
        id="resume-content"
        className="max-w-3xl mx-auto bg-white text-black rounded-xl shadow-lg p-10 space-y-8"
      >
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-semibold">{data.fullName}</h1>
          <p className="text-gray-600 text-sm mt-1">
            {data.email}{data.phone && ` · ${data.phone}`}{data.location && ` · ${data.location}`}
          </p>
          {(data.linkedin || data.github) && (
            <p className="text-gray-500 text-xs mt-1">
              {data.linkedin && <span>{data.linkedin}</span>}
              {data.linkedin && data.github && <span> · </span>}
              {data.github && <span>{data.github}</span>}
            </p>
          )}
          {data.summary && <p className="text-gray-700 text-sm mt-4">{data.summary}</p>}
        </div>

        {/* Experience */}
        {data.experience?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-amber-600 mb-3">
              Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <p className="font-medium">{exp.title} — {exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : exp.startDate ? ' - Present' : ''}</p>
                  </div>
                  {exp.description && <p className="text-sm text-gray-700 mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-amber-600 mb-3">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{proj.projectName}</p>
                    <div className="flex gap-2 text-xs text-gray-500">
                      {proj.projectUrl && <a href={proj.projectUrl} className="text-amber-600">Live</a>}
                      {proj.githubUrl && <a href={proj.githubUrl} className="text-amber-600">GitHub</a>}
                    </div>
                  </div>
                  {proj.techStack && <p className="text-xs text-gray-500 mt-0.5">{proj.techStack}</p>}
                  {proj.description && <p className="text-sm text-gray-700 mt-1">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && (
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-amber-600 mb-3">
              Education
            </h2>
            <div className="space-y-2 text-sm">
              {data.education.degree?.institution && (
                <p><span className="font-medium">Graduation / Degree:</span> {data.education.degree.institution} — {data.education.degree.board} ({data.education.degree.year}) — {data.education.degree.grade}</p>
              )}
              {data.education.seniorSecondary?.institution && (
                <p><span className="font-medium">12th / Diploma:</span> {data.education.seniorSecondary.institution} — {data.education.seniorSecondary.board} ({data.education.seniorSecondary.year}) — {data.education.seniorSecondary.grade}</p>
              )}
              {data.education.school?.institution && (
                <p><span className="font-medium">10th / School:</span> {data.education.school.institution} — {data.education.school.board} ({data.education.school.year}) — {data.education.school.grade}</p>
              )}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-amber-600 mb-3">
              Certifications
            </h2>
            <div className="space-y-2 text-sm">
              {data.certifications.map((cert, i) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <p className="font-medium">{cert.certificationName}</p>
                    {cert.issuingOrganization && <p className="text-gray-600">{cert.issuingOrganization}</p>}
                  </div>
                  <div className="text-right">
                    {cert.issueDate && <p className="text-gray-500">{cert.issueDate}</p>}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} className="text-amber-600 text-xs">View Credential</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-amber-600 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        {data.strengths?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-amber-600 mb-3">
              Strengths
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.strengths.map((s) => (
                <span key={s} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-amber-600 mb-3">
              Languages
            </h2>
            <div className="flex flex-wrap gap-4 text-sm">
              {data.languages.map((lang, i) => (
                <span key={i}>
                  <span className="font-medium">{lang.languageName}</span>
                  {lang.proficiency && <span className="text-gray-500"> — {lang.proficiency}</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data.achievements?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-amber-600 mb-3">
              Achievements
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {data.achievements.map((ach, i) => (
                <li key={i}>{ach.description}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Availability */}
        {availabilityDisplay && (
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-wide text-amber-600 mb-2">
              Availability
            </h2>
            <p className="text-sm text-gray-700">{availabilityDisplay}</p>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto flex justify-center gap-4 mt-8">
        <button
          onClick={() => navigate('/builder')}
          className="px-6 py-3 rounded-lg border border-black/10 dark:border-white/10 text-sm"
        >
          ← Edit Resume
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-3 rounded-lg bg-amber-400 text-black text-sm font-medium hover:bg-amber-300 transition-colors"
        >
          Download PDF
        </button>
      </div>
    </div>
  )
}

export default Preview