import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/share.css';

export default function Share() {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [shareStatus, setShareStatus] = useState('');

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: 'My Pitch Video',
        text: 'Check out my pitch video created with PitchLab!',
        url: window.location.origin,
      })
      setShareStatus('Shared successfully!')
    } catch (err) {
      if (err.name !== 'AbortError') {
        setShareStatus('Could not share. Try downloading the video first.')
      }
    }
  }

  const platforms = [
    {
      id: 'instagram', name: 'Instagram', icon: '📷', color: '#C13584',
      steps: ['Open Instagram app','Tap "+" icon atottom','Select Post or Reel','Choose your video','Add caption and hashtags','Tap Share'],
      tips: ['Keep videos under 60 seconds for feed','Use Reels for up to 90 seconds','Add 3-5 hashtags','Post during peak hours']
    },
    {
      id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#00f2ea',
      steps: ['Open TikTok app','Tap "+" at bottom center','Tap Upload','Select your video','Trim if needed','Add caption and hashtags','Tap Post'],
      tips: ['15-60 seconds performs best','Use trending sounds if relevant','Add text overlays','Post consistently']
    },
    {
      id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000',
      steps: ['Go to youtube.com','Click + Create','Click Upload video','Select your file','Add title and description','Add tags','Set visibility','Click Publish'],
      tips: ['Write keyword-rich description','Add 5-10 tags','Create custom thumbnail','Share link on other platforms']
    },
    {
      id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2 steps: ['Open Facebook app','Tap "What\'s on your mind?"','Tap Photo/Video','Select your video','Add a caption','Choose audience','Tap Post'],
      tips: ['Keep video under 60 seconds','Add hashtags','Tag relevant people or pages']
    },
  ];

  return (
    <div className="share">
      <div className="share-inner">
        <button className="share-back" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        <div className="share-header">
          <p className="share-label">Export & Share</p>
          <h1 className="share-title">Share Your Video</h1>
          <p className="share-subtitle">Download your best take and share it directly to your audience.</p>
        </div>

        {canShare && (
          <div className="share-native-card">
            <div className="share-native-left">
              <div className="share-native-icon">📲</div>
              <div>
                <p className="share-native-title">Share Directly from Your Phone</p>
                <p className="e-native-desc">Opens your native share sheet — pick any app instantly</p>
              </div>
            </div>
            <button className="share-native-btn" onClick={handleNativeShare}>Share Now →</button>
          </div>
        )}

        {shareStatus && <p className="share-status">{shareStatus}</p>}

        <div className="share-divider"><span>or follow platform guides below</span></div>

        {!selectedPlatform ? (
          <div className="platform-grid">
            {platforms.map((platform) => (
              <button key={platform.id} onClick={() => setSelectedPlatform(platform)} className="platform-card" style={{'--platform-color': platform.color}}>
                <span className="platform-icon">{platform.icon}</span>
                <span className="platform-name">{platform.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="instructions-container">
            <button onClick={() => setSelectedPlatform(null)} className="bacn">← Back to Platforms</button>
            <div className="platform-header">
              <span className="platform-icon-large">{selectedPlatform.icon}</span>
              <h2>How to Upload to {selectedPlatform.name}</h2>
            </div>
            {canShare && (
              <button className="share-native-inline" onClick={handleNativeShare}>
                📲 Share directly to {selectedPlatform.name} →
              </button>
            )}
            <div className="instructions-section">
              <h3 className="section-title">📝 Step-by-Step Instructions</h3>
              <ol className="steps-list">
                {selectedPlatform.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
            <div className="instructions-section">
              <h3 className="section-title">💡 Pro Tips</h3>
              <ul className="tips-list">
                {selectedPlatform.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
                     <div className="reminder-box">
              <strong>📁 Find your video:</strong>
              <p>Look for your downloaded video in your Downloads folder or Camera Roll</p>
            </div>
            <button onClick={() => setSelectedPlatform(null)} className="done-btn">Done - Back to Platforms</button>
          </div>
        )}
      </div>
    </div>
  );
}
