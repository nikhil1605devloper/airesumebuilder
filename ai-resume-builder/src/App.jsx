import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Builder from './pages/Builder'
import Analyzer from './pages/Analyzer'
import Preview from './pages/Preview'
import Results from './pages/Results'
import Resumes from './pages/Resumes'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/analyzer" element={<Analyzer />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/results" element={<Results />} />
      <Route path="/resumes" element={<Resumes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App