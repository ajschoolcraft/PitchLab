/**
 * @fileoverview Social sharing guide page.
 * Displays platform-specific step-by-step instructions for uploading
 * videos to Instagram, TikTok, YouTube, and Facebook. Includes pro tips
 * for each platform to help users maximize engagement.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/share.css'

export default function Share() {
  const navigate = useNavigate()
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷', steps: ['Open Instagram app', 'Tap + icon at the bottom', 'Select Post or Reel', 'Choose your video from gallery', 'Add caption and hashtags', 'Tap Share'], tips: ['Keep videos under 60 seconds', 'Use Reels for up to 90 seconds', 'Add 3-5 hashtags'] },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', steps: ['Open TikTok app', 'Tap + at the bottom center', 'Tap Upload', 'Select your video', 'Add caption and hashtags', 'Tap Post'], tips: ['15-60 seconds performs best', 'Use trending sounds if relevant', 'Post consistently'] },
    { id: 'youtube', name: 'YouTube', icon: '▶️', steps: ['Go to youtube.com and sign in', 'Click CreaUpload video', 'Select your file', 'Add title and description', 'Add tags', 'Click Publish'], tips: ['Write keyword-rich description', 'Create a custom thumbnail', 'Share link on other platforms'] },
    { id: 'facebook', name: 'Facebook', icon: '📘', steps: ['Open Facebook app', 'Tap What is on your mind', 'Tap Photo or Video', 'Select your video', 'Add a caption', 'Tap Post'], tips: ['Keep video under 60 seconds', 'Add hashtags to increase visibility'] },
  ]

  return (
    <div className="share">
      <div className="share-inner">
        <button className="share-back" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        <div className="share-header">
          <p className="share-label">Export and Share</p>
          <h1 className="share-title">Share Your Video</h1>
          <p className="share-subtitle">Download your video from Recordings, then follow a guide below to post it.</p>
        </div>
        {!selectedPlatform ? (
          <div className="platform-grid">
          {platforms.map((p) => (
              <button key={p.id} onClick={() => setSelectedPlatform(p)} className="platform-card">
                <span className="platform-icon">{p.icon}</span>
                <span className="platform-name">{p.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="instructions-container">
            <button onClick={() => setSelectedPlatform(null)} className="back-btn">Back to Platforms</button>
            <div className="platform-header">
              <span className="platform-icon-large">{selectedPlatform.icon}</span>
              <h2>How to Upload to {selectedPlatform.name}</h2>
            </div>
            <div className="instructions-section">
              <h3 className="section-title">Step-by-Step Instructions</h3>
              <ol className="steps-list">{selectedPlatform.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
            </div>
            <div className="instructions-section">
              <h3 className="section-title">Pro Tips</h3>
              <ul className="tips-list">{selectedPlatform.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
            <div className="reminder-box"><strong>Find your video</strong><p>Look in Downloads or Camera Roll</p></div>
            <button onClick={() => setSelectedPlatform(null)} className="done-btn">Done - Back to Platforms</button>
          </div>
        )}
      </div>
    </div>
  )
}
