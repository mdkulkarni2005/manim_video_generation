import { useState, useEffect } from 'react'
import './App.css'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from '@clerk/clerk-react'

function App() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<{ prompt: string; code: string; videoUrl: string }[]>([])
  const [activeTab, setActiveTab] = useState<'code' | 'video'>('video')
  const { isSignedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }
    setLoading(true)
    setError(null)
    setVideoUrl(null)
    setCode(null)
    try {
      const res = await fetch('http://localhost:8000/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setCode(data.code || 'No code returned.');
      
      // Check if we have a video URL from the backend
      if (data.videoUrl) {
        setVideoUrl(`http://localhost:8000${data.videoUrl}`);
      } else {
        // Use placeholder if no video is available
        setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4');
      }
      
      setChatHistory(prev => [
        { 
          prompt, 
          code: data.code || '', 
          videoUrl: data.videoUrl ? `http://localhost:8000${data.videoUrl}` : 'https://www.w3schools.com/html/mov_bbb.mp4' 
        },
        ...prev
      ]);
      setActiveTab('video');
    } catch (err) {
      setError('Failed to generate code. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <header style={{ width: '100%', marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <SignedOut>
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
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
              {activeTab === 'code' && (
                <iframe
                  src="http://localhost:8080"
                  style={{ width: '100%', height: '600px', border: 'none', borderRadius: '1rem' }}
                  title="VS Code Browser"
                />
              )}
            </div>
          </div>
        )}
        {showAuthModal && (
          <div className="auth-modal-backdrop" onClick={() => setShowAuthModal(false)}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
              <h3 className="auth-modal-title">You are not logged in</h3>
              <p className="auth-modal-desc">Please sign in or sign up to continue generating videos.</p>
              <div className="auth-modal-actions">
                <SignInButton mode="modal" />
                <SignUpButton mode="modal" />
              </div>
              <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
