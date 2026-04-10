import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'
import NavBar from './components/NavBar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Record from './pages/Record'
import ScriptGenerator from './pages/ScriptGenerator'
import Profile from './pages/Profile'
import Share from './pages/Share'
import NotFound from './pages/NotFound'
import Recordings from './pages/Recordings'
import Help from './pages/Help'


function App() {
  return (
    <AuthProvider>
      <ToastProvider>
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
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/recordings" element={
            <ProtectedRoute>
              <Recordings />
            </ProtectedRoute>
          } />
          <Route path="/share" element={
            <ProtectedRoute>
              <Share />
            </ProtectedRoute>
          } />
          <Route path="/help" element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App