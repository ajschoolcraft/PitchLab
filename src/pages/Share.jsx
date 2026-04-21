/**
 * @fileoverview Social media sharing guide page.
 * Provides platform-specific step-by-step instructions for uploading videos
 * to Facebook, Instagram, TikTok, and YouTube. Includes pro tips and best
 * practices for each platform to help users maximize engagement.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/share.css';

export default function Share() {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      color: '#1877F2',
      steps: [
        'Open the Facebook app on your phone or go to facebook.com',
        'Tap "What\'s on your mind?" at the top of your feed',
        'Tap "Photo/Video"',
        'Select your video from Downloads or Photos',
        'Add a caption describing your video',
        'Choose your audience (Public, Friends, or Custom)',
        'Tap "Post" to share your video'
      ],
      tips: [
        'For best results, keep your video under 60 seconds',
        'Add hashtags to increase visibility',
        'Tag relevant people or pages'
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      color: '#C13584',
      steps: [
        'Open the Instagram app on your phone',
        'Tap the "+" icon at the bottom center',
        'Tap "Post" (or "Reel" for short videos)',
        'Select your video from Camera Roll or Downloads',
        'Tap "Next" to add filters or edit',
        'Tap "Next" again to add a caption',
        'Add hashtags (e.g., #entrepreneur #business)',
        'Tap "Share" to post your video'
      ],
      tips: [
        'Instagram videos should be under 60 seconds for feed posts',
        'Use Reels for videos up to 90 seconds for better reach',
        'Add 3-5 relevant hashtags',
        'Post during peak hours (lunch time or evenings)'
      ]
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      color: '#00f2ea',
      steps: [
        'Open the TikTok app on your phone',
        'Tap the "+" button at the bottom center',
        'Tap "Upload" in the bottom right corner',
        'Select your video from your gallery',
        'Trim or edit your video if needed',
        'Tap "Next"',
        'Add a caption and hashtags (e.g., #SmallBusiness #Entrepreneur)',
        'Choose who can view your video',
        'Tap "Post" to share'
      ],
      tips: [
        'TikTok videos should be 15-60 seconds for best performance',
        'Use trending sounds if relevant',
        'Add text overlays for key points',
        'Post consistently for better algorithm performance'
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '▶️',
      color: '#FF0000',
      steps: [
        'Go to youtube.com and sign in',
        'Click the camera icon (+ Create) in the top right',
        'Click "Upload video"',
        'Click "SELECT FILES" and choose your video',
        'Add a title (make it descriptive and searchable)',
        'Write a description with keywords',
        'Add relevant tags',
        'Choose a thumbnail (or upload a custom one)',
        'Set visibility: Public, Unlisted, or Private',
        'Click "Publish" when ready'
      ],
      tips: [
        'Write a detailed description with keywords for SEO',
        'Add 5-10 relevant tags',
        'Create a custom thumbnail for better click-through rate',
        'Add your video to relevant playlists',
        'Share the link on other social media platforms'
      ]
    }
  ];

  const closePlatform = () => {
    setSelectedPlatform(null);
  };

  return (
    <div className="share">
      <div className="share-inner">
        <button className="share-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="share-header">
          <p className="share-label">Export & Share</p>
          <h1 className="share-title">Share Your Video</h1>
          <p className="share-subtitle">
            Choose a platform below to see step-by-step instructions for uploading your video.
          </p>
        </div>

        {!selectedPlatform ? (
          <div className="platform-grid">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform)}
                className="platform-card"
                style={{ '--platform-color': platform.color }}
              >
                <span className="platform-icon">{platform.icon}</span>
                <span className="platform-name">{platform.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="instructions-container">
            <button onClick={closePlatform} className="back-btn">
              ← Back to Platforms
            </button>

            <div className="platform-header">
              <span className="platform-icon-large">{selectedPlatform.icon}</span>
              <h2>How to Upload to {selectedPlatform.name}</h2>
            </div>

            <div className="instructions-section">
              <h3 className="section-title">📝 Step-by-Step Instructions</h3>
              <ol className="steps-list">
                {selectedPlatform.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="instructions-section">
              <h3 className="section-title">💡 Pro Tips</h3>
              <ul className="tips-list">
                {selectedPlatform.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="reminder-box">
              <strong>📁 Find your video:</strong>
              <p>Look for your downloaded video file in your Downloads folder or Camera Roll</p>
            </div>

            <button onClick={closePlatform} className="done-btn">
              Done - Back to Platforms
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
