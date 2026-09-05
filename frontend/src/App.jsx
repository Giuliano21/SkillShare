import { Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-shell"><Outlet /></main>
      <footer className="site-footer">SkillShare <span>Impara. Insegna. Condividi.</span></footer>
    </div>
  )
}

export default App
