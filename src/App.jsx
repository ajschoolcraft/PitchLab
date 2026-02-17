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
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1>AI Presentation Coach</h1>
      <p>Testing Supabase Connection</p>
      <button 
        onClick={testConnection}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Test Supabase Connection
      </button>
    </div>
  )
}

export default App