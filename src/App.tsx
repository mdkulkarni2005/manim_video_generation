import { useState } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<{ prompt: string; code: string; videoUrl: string }[]>([])
  const [activeTab, setActiveTab] = useState<'code' | 'video'>('video')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setVideoUrl(null)
    setCode(null)
    // Simulate backend call
    setTimeout(() => {
      const fakeCode = `# Example Python code\nprint('This is your generated code for: ${prompt}')`;
      const fakeVideo = 'https://www.w3schools.com/html/mov_bbb.mp4';
      setCode(fakeCode)
      setVideoUrl(fakeVideo)
      setChatHistory(prev => [
        { prompt, code: fakeCode, videoUrl: fakeVideo },
        ...prev
      ])
      setLoading(false)
      setActiveTab('video')
    }, 1500)
  }

  return (
    <div className="app-layout">
      {/* Left: Chat History */}
      <aside className="chat-history">
        <h2>Chat History</h2>
        {chatHistory.length === 0 ? (
          <div className="empty-history">No history yet</div>
        ) : (
          <ul>
            {chatHistory.map((item, idx) => (
              <li key={idx} className="history-item">
                <div className="history-prompt">{item.prompt}</div>
              </li>
            ))}
          </ul>
        )}
      </aside>
      {/* Right: Main Content */}
      <main className="main-content">
        <h1 className="title gradient-text">Prompt Video Generator</h1>
        <form className="prompt-form" onSubmit={handleSubmit}>
          <input
            className="prompt-input"
            type="text"
            placeholder="Describe the video you want..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            required
            aria-label="Prompt input"
            disabled={loading}
          />
          <button className="send-btn" type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Video'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {(videoUrl || code) && !loading && (
          <div className="tabbed-output">
            <div className="tabs">
              <button
                className={activeTab === 'video' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('video')}
              >
                Video Output
              </button>
              <button
                className={activeTab === 'code' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('code')}
              >
                See Code
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'video' && videoUrl && (
                <div className="video-card">
                  <video className="video-player" src={videoUrl} controls autoPlay poster="/vite.svg" />
                  <div className="video-caption">Your generated video</div>
                </div>
              )}
              {activeTab === 'code' && code && (
                <pre className="code-block">
                  <code>{code}</code>
                </pre>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
