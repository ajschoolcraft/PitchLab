import React, { useState } from 'react';

const ShareInstructions = ({ filename = "PresentationCoach_001.webm" }) => {
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
        `Select ${filename} from your Downloads or Photos`,
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
      color: '#E4405F',
      steps: [
        'Open the Instagram app on your phone',
        'Tap the "+" icon at the bottom center',
        'Tap "Post" (or "Reel" for short videos)',
        `Select ${filename} from your Camera Roll or Downloads`,
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
      color: '#000000',
      steps: [
        'Open the TikTok app on your phone',
        'Tap the "+" button at the bottom center',
        'Tap "Upload" in the bottom right corner',
        `Select ${filename} from your gallery`,
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
        `Click "SELECT FILES" and choose ${filename}`,
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📤 Share Your Video</h2>
        <p style={styles.subtitle}>
          Choose a platform below to see step-by-step instructions for uploading your video.
        </p>

        {!selectedPlatform ? (
          <div style={styles.platformGrid}>
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform)}
                style={{
                  ...styles.platformButton,
                  borderColor: platform.color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = platform.color;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#333';
                }}
              >
                <span style={styles.platformIcon}>{platform.icon}</span>
                <span style={styles.platformName}>{platform.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div style={styles.instructionsContainer}>
            <button onClick={closePlatform} style={styles.backButton}>
              ← Back to Platforms
            </button>

            <div style={styles.platformHeader}>
              <span style={styles.platformIconLarge}>{selectedPlatform.icon}</span>
              <h3 style={styles.platformTitle}>How to Upload to {selectedPlatform.name}</h3>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>📝 Step-by-Step Instructions:</h4>
              <ol style={styles.stepsList}>
                {selectedPlatform.steps.map((step, index) => (
                  <li key={index} style={styles.step}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>💡 Pro Tips:</h4>
              <ul style={styles.tipsList}>
                {selectedPlatform.tips.map((tip, index) => (
                  <li key={index} style={styles.tip}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.filenameReminder}>
              <strong>📁 Your video file:</strong> {filename}
              <br />
              <span style={styles.filenameSubtext}>
                Look for this file in your Downloads folder or Camera Roll
              </span>
            </div>

            <button onClick={closePlatform} style={styles.doneButton}>
              Done - Back to Platforms
            </button>
          </div>
        )}

        <div style={styles.footer}>
          <p style={styles.footerText}>
            💡 <strong>Tip:</strong> Your video has been downloaded and is ready to upload!
            Follow the instructions for your chosen platform.
          </p>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '12px',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '32px',
    lineHeight: '1.5',
  },
  platformGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  platformButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '24px',
    backgroundColor: 'white',
    border: '3px solid',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '16px',
    fontWeight: '600',
  },
  platformIcon: {
    fontSize: '48px',
  },
  platformName: {
    fontSize: '18px',
  },
  instructionsContainer: {
    animation: 'fadeIn 0.3s',
  },
  backButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '24px',
  },
  platformHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e0e0e0',
  },
  platformIconLarge: {
    fontSize: '56px',
  },
  platformTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
  },
  stepsList: {
    paddingLeft: '24px',
    margin: 0,
  },
  step: {
    fontSize: '16px',
    color: '#444',
    lineHeight: '1.8',
    marginBottom: '12px',
  },
  tipsList: {
    paddingLeft: '24px',
    margin: 0,
  },
  tip: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.7',
    marginBottom: '10px',
  },
  filenameReminder: {
    backgroundColor: '#e3f2fd',
    border: '1px solid #90caf9',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '24px',
    marginBottom: '24px',
    fontSize: '15px',
    lineHeight: '1.6',
  },
  filenameSubtext: {
    fontSize: '13px',
    color: '#666',
    fontStyle: 'italic',
  },
  doneButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  footer: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e0e0e0',
  },
  footerText: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default ShareInstructions;
