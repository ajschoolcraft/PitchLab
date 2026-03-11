import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import NavBar from './components/NavBar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Record from './pages/Record'
import ScriptGenerator from './pages/ScriptGenerator'

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/record" element={
          <ProtectedRoute>
            <Record />
          </ProtectedRoute>
        } />
        <Route path="/script-generator" element={
          <ProtectedRoute>
            <ScriptGenerator />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App