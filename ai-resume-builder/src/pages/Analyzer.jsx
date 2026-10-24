import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'

function Analyzer() {
  const [file, setFile] = useState(null)
  const navigate = useNavigate()

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const handleAnalyze = () => {
    // Backend/AI call will go here later — for now just navigate with a placeholder
    navigate('/results', { state: { fileName: file?.name } })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-black dark:text-white flex flex-col items-center justify-center px-6 transition-colors duration-300">
      <div className="text-center mb-10">
        <p className="text-amber-500 dark:text-amber-400 text-sm tracking-[0.3em] uppercase mb-3">
          AI Analyzer
        </p>
        <h1 className="text-4xl font-semibold mb-3">Upload Your Resume</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Get an instant ATS score and detailed feedback to improve your resume.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`w-full max-w-lg rounded-2xl border-2 border-dashed p-14 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-amber-400 bg-amber-400/10'
            : 'border-black/15 dark:border-white/15 hover:border-amber-400/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-5xl mb-4">📄</div>
        {file ? (
          <p className="text-amber-500 dark:text-amber-400 font-medium">{file.name}</p>
        ) : isDragActive ? (
          <p className="text-gray-700 dark:text-gray-300">Drop your resume here...</p>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Drag & drop your resume here
            </p>
            <p className="text-gray-500 text-sm">or click to browse — PDF or DOCX only</p>
          </>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!file}
        className="mt-8 px-8 py-3 rounded-lg bg-amber-400 text-black text-sm font-medium hover:bg-amber-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Analyze Resume ✨
      </button>
    </div>
  )
}

export default Analyzer