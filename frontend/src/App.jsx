import { Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-shell"><Outlet /></main>
      <footer className="site-footer">skillshare.  <span>Dove studenti e tutor si incontrano</span> <span>© 2026 Giuliano Capitelli, Kristian Lika</span></footer>
    </div>
  )
}

export default App
