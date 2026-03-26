import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'
import NavBar from './components/NavBar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Record from './pages/Record'
<<<<<<< HEAD
import ScriptGeneratorV2 from './pages/ScriptGeneratorV2'
=======
import ScriptGenerator from './pages/ScriptGenerator'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
>>>>>>> 1eca1caacbcbb66c89ed5eca3e3ca81275aa9fc8

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
              <ScriptGeneratorV2 />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App