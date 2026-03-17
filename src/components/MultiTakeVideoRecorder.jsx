import React, { useState, useRef, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';

// ShareInstructions Component - Embedded
const ShareInstructions = ({ filename, onBack }) => {
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

  const shareStyles = {
    container: {
      padding: '20px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
      position: 'relative',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#333',
      flex: 1,
    },
    dashboardButton: {
      position: 'absolute',
      right: 0,
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    subtitle: {
      fontSize: '16px',
      color: '#666',
      textAlign: 'center',
      marginBottom: '24px',
      lineHeight: '1.5',
    },
    platformGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
      marginBottom: '24px',
    },
    platformButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      padding: '20px',
      backgroundColor: 'white',
      border: '3px solid',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '16px',
      fontWeight: '600',
    },
    platformIcon: {
      fontSize: '40px',
    },
    platformName: {
      fontSize: '16px',
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
      marginBottom: '20px',
    },
    platformHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '2px solid #e0e0e0',
    },
    platformIconLarge: {
      fontSize: '48px',
    },
    platformTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0,
    },
    section: {
      marginBottom: '20px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '10px',
    },
    stepsList: {
      paddingLeft: '24px',
      margin: 0,
    },
    step: {
      fontSize: '15px',
      color: '#444',
      lineHeight: '1.7',
      marginBottom: '10px',
    },
    tipsList: {
      paddingLeft: '24px',
      margin: 0,
    },
    tip: {
      fontSize: '14px',
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '8px',
    },
    filenameReminder: {
      backgroundColor: '#e3f2fd',
      border: '1px solid #90caf9',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '20px',
      marginBottom: '20px',
      fontSize: '14px',
      lineHeight: '1.6',
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
      marginBottom: '12px',
    },
    mainBackButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
    },
  };

  return (
    <div style={shareStyles.container}>
      <div style={shareStyles.header}>
        <h2 style={shareStyles.title}>📤 Share Your Video</h2>
        <button onClick={() => window.location.href = '/dashboard'} style={shareStyles.dashboardButton}>
          Dashboard
        </button>
      </div>
      <p style={shareStyles.subtitle}>
        Choose a platform below to see step-by-step instructions for uploading your video.
      </p>

      {!selectedPlatform ? (
        <>
          <div style={shareStyles.platformGrid}>
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform)}
                style={{
                  ...shareStyles.platformButton,
                  borderColor: platform.color,
                }}
              >
                <span style={shareStyles.platformIcon}>{platform.icon}</span>
                <span style={shareStyles.platformName}>{platform.name}</span>
              </button>
            ))}
          </div>
          <button onClick={onBack} style={shareStyles.mainBackButton}>
            Back to Recorder
          </button>
        </>
      ) : (
        <div>
          <button onClick={() => setSelectedPlatform(null)} style={shareStyles.backButton}>
            ← Back to Platforms
          </button>

          <div style={shareStyles.platformHeader}>
            <span style={shareStyles.platformIconLarge}>{selectedPlatform.icon}</span>
            <h3 style={shareStyles.platformTitle}>How to Upload to {selectedPlatform.name}</h3>
          </div>

          <div style={shareStyles.section}>
            <h4 style={shareStyles.sectionTitle}>📝 Step-by-Step Instructions:</h4>
            <ol style={shareStyles.stepsList}>
              {selectedPlatform.steps.map((step, index) => (
                <li key={index} style={shareStyles.step}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div style={shareStyles.section}>
            <h4 style={shareStyles.sectionTitle}>💡 Pro Tips:</h4>
            <ul style={shareStyles.tipsList}>
              {selectedPlatform.tips.map((tip, index) => (
                <li key={index} style={shareStyles.tip}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div style={shareStyles.filenameReminder}>
            <strong>📁 Your video file:</strong> {filename}
            <br />
            <span style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
              Look for this file in your Downloads folder or Camera Roll
            </span>
          </div>

          <button onClick={() => setSelectedPlatform(null)} style={shareStyles.doneButton}>
            Done - Back to Platforms
          </button>
          <button onClick={onBack} style={shareStyles.mainBackButton}>
            Back to Recorder
          </button>
        </div>
      )}
    </div>
  );
};

// Main MultiTakeVideoRecorder Component
const MultiTakeVideoRecorder = () => {
  const { user } = useContext(AuthContext); // Get logged-in user
  
  const [isRecording, setIsRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [error, setError] = useState(null);
  const [takes, setTakes] = useState([]);
  const [selectedTake, setSelectedTake] = useState(null);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [downloadCounter, setDownloadCounter] = useState(1);
  const [showShareInstructions, setShowShareInstructions] = useState(false);
  const [lastDownloadedFilename, setLastDownloadedFilename] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const videoPreviewRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Load download counter from localStorage
  useEffect(() => {
    const savedCounter = localStorage.getItem('presentationCoachCounter');
    if (savedCounter) {
      setDownloadCounter(parseInt(savedCounter));
    }
  }, []);

  // Request camera and microphone permissions
  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      streamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      setPermissionGranted(true);
      setError(null);
    } catch (err) {
      console.error('Permission error:', err);
      setError('Camera/microphone access denied. Please enable permissions in your browser settings.');
    }
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) {
      setError('No camera stream available');
      return;
    }

    chunksRef.current = [];
    
    const options = { 
      mimeType: 'video/webm;codecs=vp8,opus',
      videoBitsPerSecond: 2500000
    };

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        const newTake = {
          id: Date.now(),
          url: url,
          blob: blob,
          timestamp: new Date().toLocaleString(),
          duration: 60 - timeRemaining
        };
        
        setTakes(prev => [...prev, newTake]);
        setSelectedTake(newTake);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100);
      setIsRecording(true);
      setTimeRemaining(60);

      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Recording error:', err);
      setError('Failed to start recording. Your browser may not support this feature.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Upload video to Supabase
  const uploadToSupabase = async (take) => {
    if (!user) {
      setError('You must be logged in to save videos');
      return null;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const videoId = Date.now();
      const fileName = `${user.id}/${videoId}.webm`;
      const filePath = `videos/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, take.blob, {
          contentType: 'video/webm',
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setError('Failed to upload video. Please try again.');
        setUploading(false);
        return null;
      }

      setUploadProgress(50);

      // Save metadata to database
      const { data: metadataData, error: metadataError } = await supabase
        .from('user_vids')
        .insert({
          user_id: user.id,
          storage_path: filePath,
          duration_secs: take.duration,
          final_size_bytes: take.blob.size,
          status: 'draft'
        })
        .select()
        .single();

      if (metadataError) {
        console.error('Metadata error:', metadataError);
        setError('Video uploaded but failed to save details. Please contact support.');
        setUploading(false);
        return null;
      }

      setUploadProgress(100);
      setUploading(false);
      
      return metadataData;
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Something went wrong. Please try again.');
      setUploading(false);
      return null;
    }
  };

  // Download a specific take
  const downloadTake = async (take, showPrompt = true) => {
    if (showPrompt && takes.length > 1) {
      setSelectedTake(take);
      setShowDeletePrompt(true);
      return;
    }

    const filename = `PresentationCoach_${String(downloadCounter).padStart(3, '0')}.webm`;
    
    // Download to user's device
    const a = document.createElement('a');
    a.href = take.url;
    a.download = filename;
    a.click();

    // Also upload to Supabase if user is logged in
    if (user) {
      await uploadToSupabase(take);
    }

    const newCounter = downloadCounter + 1;
    setDownloadCounter(newCounter);
    localStorage.setItem('presentationCoachCounter', newCounter.toString());
    
    // Show share instructions after download
    setLastDownloadedFilename(filename);
    setShowShareInstructions(true);
  };

  // Download and delete other takes
  const downloadAndDeleteOthers = async () => {
    if (!selectedTake) return;

    await downloadTake(selectedTake, false);

    takes.forEach(take => {
      if (take.id !== selectedTake.id) {
        URL.revokeObjectURL(take.url);
      }
    });

    setTakes([selectedTake]);
    setShowDeletePrompt(false);
  };

  // Download and keep all takes
  const downloadAndKeepRecording = async () => {
    if (!selectedTake) return;
    
    await downloadTake(selectedTake, false);
    setShowDeletePrompt(false);
  };

  // Delete a specific take
  const deleteTake = (takeId) => {
    const take = takes.find(t => t.id === takeId);
    if (take) {
      URL.revokeObjectURL(take.url);
    }
    
    setTakes(prev => prev.filter(t => t.id !== takeId));
    
    if (selectedTake?.id === takeId) {
      setSelectedTake(takes.length > 1 ? takes[0] : null);
    }
  };

  // Delete all takes
  const deleteAllTakes = () => {
    takes.forEach(take => URL.revokeObjectURL(take.url));
    setTakes([]);
    setSelectedTake(null);
  };

  // Record another take
  const recordAnother = () => {
    setSelectedTake(null);
    setTimeRemaining(60);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      takes.forEach(take => URL.revokeObjectURL(take.url));
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [takes]);

  // If showing share instructions, render that instead
  if (showShareInstructions) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <ShareInstructions 
            filename={lastDownloadedFilename} 
            onBack={() => setShowShareInstructions(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>🎥 Multi-Take Video Recorder</h2>
          <button onClick={() => window.location.href = '/dashboard'} style={styles.dashboardButton}>
            Dashboard
          </button>
        </div>
        
        {error && (
          <div style={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {uploading && (
          <div style={styles.uploadProgress}>
            <div style={styles.uploadBar}>
              <div style={{...styles.uploadFill, width: `${uploadProgress}%`}}></div>
            </div>
            <p style={styles.uploadText}>
              {uploadProgress < 50 ? 'Uploading video...' : 'Saving details...'}
            </p>
          </div>
        )}

        {takes.length > 0 && (
          <div style={styles.takesCounter}>
            📹 {takes.length} take{takes.length !== 1 ? 's' : ''} recorded
            {user && ' • Videos saved to your account'}
          </div>
        )}

        {!permissionGranted && takes.length === 0 && (
          <div style={styles.permissionSection}>
            <p style={styles.description}>
              Record multiple takes and choose your best one. 
              Videos are stored temporarily until you download or close this page.
              {user && ' When you download, videos are automatically saved to your account.'}
            </p>
            <button onClick={requestPermissions} style={styles.primaryButton}>
              Enable Camera
            </button>
          </div>
        )}

        {permissionGranted && !selectedTake && (
          <div style={styles.recordingSection}>
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              style={{...styles.video, transform: 'scaleX(-1)'}}
            />
            
            {isRecording && (
              <div style={styles.recordingIndicator}>
                <span style={styles.recordingDot}>●</span>
                <span>Recording: {timeRemaining}s remaining</span>
              </div>
            )}

            <div style={styles.controls}>
              {!isRecording ? (
                <button onClick={startRecording} style={styles.recordButton}>
                  {takes.length > 0 ? 'Record\nAnother' : 'Start\nRecording'}
                </button>
              ) : (
                <button onClick={stopRecording} style={styles.stopButton}>
                  Stop Recording
                </button>
              )}
            </div>

            {takes.length > 0 && (
              <button onClick={() => setSelectedTake(takes[takes.length - 1])} style={styles.secondaryButton}>
                Review Takes ({takes.length})
              </button>
            )}
          </div>
        )}

        {selectedTake && (
          <div style={styles.playbackSection}>
            <video
              src={selectedTake.url}
              controls
              style={styles.video}
            />
            
            <div style={styles.takeInfo}>
              <strong>Take #{takes.findIndex(t => t.id === selectedTake.id) + 1}</strong>
              <span style={styles.timestamp}>{selectedTake.timestamp}</span>
            </div>

            {takes.length > 1 && (
              <div style={styles.takesList}>
                <h3 style={styles.takesListTitle}>All Takes:</h3>
                <div style={styles.takesGrid}>
                  {takes.map((take, index) => (
                    <div 
                      key={take.id} 
                      style={{
                        ...styles.takeItem,
                        ...(selectedTake.id === take.id ? styles.takeItemSelected : {})
                      }}
                      onClick={() => setSelectedTake(take)}
                    >
                      <div style={styles.takeNumber}>#{index + 1}</div>
                      <div style={styles.takeTime}>{take.duration}s</div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTake(take.id);
                        }}
                        style={styles.deleteTakeBtn}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.controls}>
              <button onClick={() => downloadTake(selectedTake)} style={styles.primaryButton}>
                {user ? 'Download & Save' : 'Download This Take'}
              </button>
              <button onClick={recordAnother} style={styles.secondaryButton}>
                Record Another
              </button>
            </div>

            {takes.length > 1 && (
              <button onClick={deleteAllTakes} style={styles.dangerButton}>
                Delete All Takes
              </button>
            )}

            <p style={styles.hint}>
              💡 Next download will be: PresentationCoach_{String(downloadCounter).padStart(3, '0')}.webm
              {user && ' (Also saved to your cloud account)'}
            </p>
          </div>
        )}

        {showDeletePrompt && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={styles.modalTitle}>Download Options</h3>
              <p style={styles.modalText}>
                You have {takes.length} takes recorded. What would you like to do?
              </p>
              
              <button onClick={downloadAndDeleteOthers} style={styles.modalPrimaryButton}>
                Download This & Delete Others
              </button>
              
              <button onClick={downloadAndKeepRecording} style={styles.modalSecondaryButton}>
                Download This & Keep All Takes
              </button>
              
              <button onClick={() => setShowDeletePrompt(false)} style={styles.modalCancelButton}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          ✓ Record unlimited takes<br />
          ✓ Review and compare all recordings<br />
          ✓ Download your favorite with custom naming<br />
          {user ? '✓ Videos automatically saved to your account' : '⚠️ Log in to save videos to your account'}<br />
          ⚠️ Temporary takes deleted when you close this tab
        </p>
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
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    flex: 1,
  },
  dashboardButton: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  uploadProgress: {
    backgroundColor: '#e3f2fd',
    border: '1px solid #90caf9',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },
  uploadBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  uploadFill: {
    height: '100%',
    backgroundColor: '#007bff',
    transition: 'width 0.3s ease',
  },
  uploadText: {
    fontSize: '14px',
    color: '#1976d2',
    textAlign: 'center',
    margin: 0,
  },
  takesCounter: {
    backgroundColor: '#e3f2fd',
    border: '1px solid #90caf9',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1976d2',
  },
  error: {
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    color: '#c33',
  },
  permissionSection: {
    textAlign: 'center',
    padding: '20px 0',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  recordingSection: {
    position: 'relative',
  },
  video: {
    width: '100%',
    borderRadius: '8px',
    backgroundColor: '#000',
    marginBottom: '16px',
  },
  recordingIndicator: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  recordingDot: {
    color: '#ff4444',
    fontSize: '20px',
    animation: 'pulse 1.5s infinite',
  },
  controls: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  primaryButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  recordButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(220,53,69,0.3)',
    whiteSpace: 'pre-line',
  },
  stopButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px',
    width: '100%',
  },
  playbackSection: {
    textAlign: 'center',
  },
  takeInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  timestamp: {
    fontSize: '12px',
    color: '#666',
  },
  takesList: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  takesListTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    textAlign: 'left',
  },
  takesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  takeItem: {
    position: 'relative',
    padding: '16px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  takeItemSelected: {
    backgroundColor: '#e3f2fd',
    border: '2px solid #007bff',
  },
  takeNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  takeTime: {
    fontSize: '12px',
    color: '#666',
  },
  deleteTakeBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  hint: {
    fontSize: '14px',
    color: '#666',
    marginTop: '16px',
    lineHeight: '1.5',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '12px',
    textAlign: 'center',
  },
  modalText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  modalPrimaryButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '12px',
  },
  modalSecondaryButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '12px',
  },
  modalCancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  footer: {
    maxWidth: '600px',
    margin: '20px auto 0',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.8',
  },
};

export default MultiTakeVideoRecorder;
