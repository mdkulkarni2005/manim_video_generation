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
import FutureFeatures from './components/FutureFeatures'
import './components/FutureFeatures.css'

// Animation examples to suggest to users
const ANIMATION_EXAMPLES = [
  "Create a circle that transforms into a square with a smooth animation",
  "Show the Fibonacci sequence visually with growing squares in a spiral",
  "Animate the Pythagorean theorem with right triangles",
  "Create a 3D animation of a rotating cube that transforms into a sphere",
  "Visualize sine and cosine waves with points moving along a circle"
];

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
  const [processing, setProcessing] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);

  // Rotate through example prompts for the placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((prevIndex) => (prevIndex + 1) % ANIMATION_EXAMPLES.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

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
      // First show processing animation
      setProcessing(true);
      
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
      setProcessing(false);
    }
  }
  
  const handleHistoryClick = (item: { prompt: string; code: string; videoUrl: string }) => {
    setPrompt(item.prompt);
    setCode(item.code);
    setVideoUrl(item.videoUrl);
  };

  const handleExampleClick = () => {
    setPrompt(ANIMATION_EXAMPLES[exampleIndex]);
  };

  return (
    <div className="app-layout">
      {/* Left: Chat History */}
      <aside className="chat-history">
        <div className="chat-history-header">
          <h2>Generation History</h2>
        </div>
        {chatHistory.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📹</div>
            <p>Your animation history will appear here</p>
            <button className="suggestion-btn" onClick={handleExampleClick}>
              Try an example
            </button>
          </div>
        ) : (
          <ul className="history-list">
            {chatHistory.map((item, idx) => (
              <li key={idx} className="history-item" onClick={() => handleHistoryClick(item)}>
                <div className="history-item-content">
                  <div className="history-prompt">{item.prompt}</div>
                  <div className="history-timestamp">{new Date().toLocaleTimeString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
      
      {/* Right: Main Content */}
      <main className="main-content">
        <header className="app-header">
          <div className="logo-area">
            <span className="app-logo">🎬</span>
            <h1 className="app-title">Manim<span className="title-highlight">Generator</span></h1>
          </div>
          <div className="auth-area">
            <SignedOut>
              <SignInButton mode="modal" />
              <SignUpButton mode="modal" />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        
        <div className="main-container">
          <h2 className="main-title">Create Mathematical Animations</h2>
          <p className="main-subtitle">Describe the animation you want to create with Manim</p>
          
          <div className="feature-highlights">
            <div className="feature">
              <div className="feature-icon">✨</div>
              <div className="feature-text">AI-Powered Code Generation</div>
            </div>
            <div className="feature">
              <div className="feature-icon">🎨</div>
              <div className="feature-text">Beautiful Math Visualizations</div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔄</div>
              <div className="feature-text">Automatic Rendering</div>
            </div>
          </div>
          
          <form className="prompt-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                className="prompt-input"
                type="text"
                placeholder={`e.g., ${ANIMATION_EXAMPLES[exampleIndex]}`}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                required
                aria-label="Prompt input"
                disabled={loading}
              />
              <button className="send-btn" type="submit" disabled={loading}>
                {loading ? 
                  <span className="loading-text">
                    <span className="loading-spinner"></span>
                    Generating...
                  </span> : 
                  'Generate Animation'
                }
              </button>
            </div>
            <div className="prompt-suggestions">
              <button 
                type="button" 
                className="suggestion-pill"
                onClick={() => setPrompt(ANIMATION_EXAMPLES[0])}
              >
                Circle to Square
              </button>
              <button 
                type="button" 
                className="suggestion-pill"
                onClick={() => setPrompt(ANIMATION_EXAMPLES[1])}
              >
                Fibonacci Spiral
              </button>
              <button 
                type="button" 
                className="suggestion-pill"
                onClick={() => setPrompt(ANIMATION_EXAMPLES[2])}
              >
                Pythagorean Theorem
              </button>
            </div>
          </form>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          {processing && (
            <div className="processing-indicator">
              <div className="processing-animation">
                <div className="processing-step">
                  <div className="step-icon">📝</div>
                  <div>Generating code</div>
                </div>
                <div className="processing-step">
                  <div className="step-icon">🔄</div>
                  <div>Creating animation</div>
                </div>
                <div className="processing-step">
                  <div className="step-icon">🎬</div>
                  <div>Rendering video</div>
                </div>
              </div>
              <p className="processing-message">Please wait while we create your animation...</p>
            </div>
          )}
          
          {(videoUrl || code) && !loading ? (
            <div className="tabbed-output">
              <div className="tabs">
                <button
                  className={activeTab === 'video' ? 'tab active' : 'tab'}
                  onClick={() => setActiveTab('video')}
                >
                  <span className="tab-icon">🎬</span>
                  Animation Output
                </button>
                <button
                  className={activeTab === 'code' ? 'tab active' : 'tab'}
                  onClick={() => setActiveTab('code')}
                >
                  <span className="tab-icon">💻</span>
                  View Code
                </button>
              </div>
              <div className="tab-content">
                {activeTab === 'video' && videoUrl && (
                  <div className="video-card">
                    <video className="video-player" src={videoUrl} controls autoPlay poster="/vite.svg" />
                    <div className="video-controls">
                      <div className="video-caption">Your generated animation</div>
                      <a href={videoUrl} download className="download-btn">
                        <span className="download-icon">⬇️</span> Download Video
                      </a>
                    </div>
                  </div>
                )}
                {activeTab === 'code' && (
                  <div className="code-container">
                    <div className="code-header">
                      <div className="code-title">Generated Manim Code</div>
                      <div className="code-actions">
                        <button className="code-action-btn" onClick={() => navigator.clipboard.writeText(code || '')}>
                          <span className="action-icon">📋</span> Copy Code
                        </button>
                      </div>
                    </div>
                    <iframe
                      src="http://localhost:8080"
                      style={{ width: '100%', height: '600px', border: 'none', borderRadius: '1rem' }}
                      title="VS Code Browser"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : !processing && !loading ? (
            <div className="welcome-placeholder">
              <div className="placeholder-icon">🎭</div>
              <h2 className="placeholder-title">Create Beautiful Mathematical Animations</h2>
              <p className="placeholder-text">
                Welcome to Manim Generator! Describe the mathematical animation you want to create,
                and our AI will generate the code and render the video for you.
              </p>
              
              <div className="placeholder-steps">
                <div className="step-card" data-step="1">
                  <div className="step-icon">✏️</div>
                  <div className="step-title">Describe</div>
                  <div className="step-desc">Enter your animation idea above</div>
                </div>
                <div className="step-card" data-step="2">
                  <div className="step-icon">🤖</div>
                  <div className="step-title">Generate</div>
                  <div className="step-desc">AI creates the Manim code</div>
                </div>
                <div className="step-card" data-step="3">
                  <div className="step-icon">🎬</div>
                  <div className="step-title">Watch</div>
                  <div className="step-desc">View and download your animation</div>
                </div>
              </div>
              
              <h3 className="placeholder-title" style={{ fontSize: '1.25rem', marginTop: '1rem' }}>Try These Examples</h3>
              <div className="examples-section">
                <div className="example-card" onClick={() => setPrompt("Create a circle that transforms into a square with a smooth animation")}>
                  <div className="example-img">
                    <div className="example-img-icon">⭕</div>
                  </div>
                  <div className="example-content">
                    <div className="example-title">Circle to Square</div>
                    <div className="example-desc">Smooth morphing animation between shapes</div>
                  </div>
                </div>
                <div className="example-card" onClick={() => setPrompt("Visualize the Pythagorean theorem with animated right triangles")}>
                  <div className="example-img">
                    <div className="example-img-icon">📐</div>
                  </div>
                  <div className="example-content">
                    <div className="example-title">Pythagorean Theorem</div>
                    <div className="example-desc">Visual proof with animated triangles</div>
                  </div>
                </div>
                <div className="example-card" onClick={() => setPrompt("Show the Fibonacci sequence visually with growing squares in a spiral")}>
                  <div className="example-img">
                    <div className="example-img-icon">🌀</div>
                  </div>
                  <div className="example-content">
                    <div className="example-title">Fibonacci Spiral</div>
                    <div className="example-desc">Growing squares forming the golden spiral</div>
                  </div>
                </div>
                <div className="example-card" onClick={() => setPrompt("Animate sine and cosine waves with points moving along a circle")}>
                  <div className="example-img">
                    <div className="example-img-icon">〰️</div>
                  </div>
                  <div className="example-content">
                    <div className="example-title">Sine and Cosine</div>
                    <div className="example-desc">Trigonometric functions visualized</div>
                  </div>
                </div>
              </div>
              
              {/* Future Features Section */}
              <div style={{ marginTop: '2rem', width: '100%' }}>
                <FutureFeatures />
              </div>
            </div>
          ) : null}
        </div>
        
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-text">© 2025 Manim Generator</div>
            <div className="footer-links">
              <a href="#">About</a>
              <a href="#">Documentation</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
