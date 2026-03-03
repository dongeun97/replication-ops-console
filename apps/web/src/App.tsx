import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from '@/pages/Dashboard'
import Agents from '@/pages/Agents'
import Jobs from '@/pages/Jobs'
import Logs from '@/pages/Logs'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow px-8 py-4 flex items-center gap-8">
          <span className="font-bold text-xl text-blue-900">Replication Ops Console</span>
          <NavLink to="/" end className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-blue-600"}>
            Dashboard
          </NavLink>
          <NavLink to="/agents" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-blue-600"}>
            Agents
          </NavLink>
          <NavLink to="/jobs" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-blue-600"}>
            Jobs
          </NavLink>
          <NavLink to="/logs" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-blue-600"}>
            Logs
          </NavLink>
        </nav>
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App