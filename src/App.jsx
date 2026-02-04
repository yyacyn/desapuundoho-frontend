import { useState } from 'react'
import { apiCall } from './config/api'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const data = await apiCall('hello')
      setMessage(data.message)
    } catch (error) {
      setMessage('Error: Could not connect to backend')
    }
    setLoading(false)
  }

  return (
    <div className="App">
      <h1>Desa Puundoho</h1>
      <p>Simple React + Golang Test</p>

      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Test Backend Connection'}
      </button>

      {message && (
        <div className="message">
          <p>{message}</p>
        </div>
      )}
    </div>
  )
}

export default App
