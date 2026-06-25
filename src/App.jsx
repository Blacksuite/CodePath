import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PhaseOverview from './pages/PhaseOverview.jsx'
import Lesson from './pages/Lesson.jsx'
import StructuredLesson from './pages/StructuredLesson.jsx'
import Quiz from './pages/Quiz.jsx'
import Projects from './pages/Projects.jsx'
import Cheatsheets from './pages/Cheatsheets.jsx'
import HowToLearn from './pages/HowToLearn.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/phase/:id" element={<PhaseOverview />} />
        <Route path="/phase/:id/lesson" element={<Lesson />} />
        <Route path="/phase/:id/lesson/:lessonId" element={<StructuredLesson />} />
        <Route path="/phase/:id/quiz" element={<Quiz />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/cheatsheets" element={<Cheatsheets />} />
        <Route path="/cheatsheets/:id" element={<Cheatsheets />} />
        <Route path="/how-to-learn" element={<HowToLearn />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
