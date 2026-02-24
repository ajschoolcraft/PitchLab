import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Record from './pages/Record'
import ScriptGenerator from './pages/ScriptGenerator'
import { supabase } from './lib/supabase'

function App() {
  const testConnection = async () => {
    console.log('Testing connection...')
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Connection error:', error)
    } else {
      console.log('✅ Connected to Supabase!', data)
    }
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/record" element={<Record />} />
        <Route path="/script-generator" element={<ScriptGenerator />} />
      </Routes>

      {/* Test Connection Button - Can remove this later */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px',
        padding: '20px',
        backgroundColor: 'white',
        border: '2px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Dev Tools</h3>
        <button 
          onClick={testConnection}
          style={{ 
            padding: '8px 16px', 
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Test Supabase Connection
        </button>
      </div>
    </AuthProvider>
  )
}

export default App