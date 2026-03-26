import React, { useState, useRef, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';

// Add console log at the very top
console.log('========================================');
console.log('🔥🔥🔥 VIDEO RECORDER LOADED - NEW VERSION');
console.log('========================================');

const MultiTakeVideoRecorder = ({ script }) => {
  const { user } = useContext(AuthContext);
  
  const [isRecording, setIsRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [error, setError] = useState(null);
  const [takes, setTakes] = useState([]);
  const [selectedTake, setSelectedTake] = useState(null);
  const [downloadCounter, setDownloadCounter] = useState(1);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Load counter
  useEffect(() => {
    const saved = localStorage.getItem('presentationCoachCounter');
    if (saved) setDownloadCounter(parseInt(saved));
  }, []);

  // Request permissions
  const requestPermissions = async () => {
    console.log('🎥 ENABLE CAMERA CLICKED');
    try {
      console.log('📞 Requesting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: true
      });

      console.log('✅ Got stream!', stream);
      console.log('📹 Active?', stream.active);
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        console.log('🔗 Connecting to video element...');
        videoRef.current.srcObject = stream;
        
        // Force play
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => console.log('▶️ Playing!'))
              .catch(e => console.error('❌ Play failed:', e));
          }
        }, 100);
      }
      
      setPermissionGranted(true);
      setError(null);
    } catch (err) {
      console.error('❌ Camera error:', err);
      setError('Camera access denied');
    }
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) return;

    const startTime = Date.now();
    
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp8,opus',
      videoBitsPerSecond: 2500000
    });
    
    recorder.ondataavailable = (e) => {
      if (e.data?.size > 0) chunksRef.current.push(e.data);
    };
    
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      const actualDuration = Math.round((Date.now() - startTime) / 1000);
      
      setTakes(prev => [...prev, {
        id: Date.now(),
        url,
        blob,
        timestamp: new Date().toLocaleString(),
        duration: actualDuration
      }]);
      
      if (timerRef.current) clearInterval(timerRef.current);
    };
    
    mediaRecorderRef.current = recorder;
    recorder.start(100);
    setIsRecording(true);
    setTimeRemaining(60);
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const downloadTake = async (take) => {
    const filename = `PresentationCoach_${String(downloadCounter).padStart(3, '0')}.webm`;
    
    // Keep existing download functionality
    const a = document.createElement('a');
    a.href = take.url;
    a.download = filename;
    a.click();
    
    const newCounter = downloadCounter + 1;
    setDownloadCounter(newCounter);
    localStorage.setItem('presentationCoachCounter', newCounter.toString());
  
    // ADD: Upload to Supabase
    try {
      if (!user) {
        console.log('User not logged in - skipping Supabase upload');
        return;
      }
  
      // Convert blob URL to actual blob
      const response = await fetch(take.url);
      const blob = await response.blob();
  
      // Generate unique video ID
      const videoId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const storagePath = `${user.id}/${videoId}.webm`;
  
      console.log('Uploading video to Supabase...');
  
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(storagePath, blob);
  
      if (uploadError) {
        console.error('Upload error:', uploadError);
        return;
      }
  
      console.log('Video uploaded successfully:', uploadData);
  
      // Get video duration
      const videoDuration = take.duration || 0;
  
      // Save metadata to user_vids table
      const { data: dbData, error: dbError } = await supabase
        .from('user_vids')
        .insert({
          user_id: user.id,
          script_id: script?.id || null,
          storage_path: storagePath,
          duration_secs: Math.round(videoDuration),
          final_size_bytes: blob.size,
          status: 'draft'
        })
        .select();
  
      if (dbError) {
        console.error('Database error:', dbError);
        return;
      }
  
      console.log('Video metadata saved to database:', dbData);
      alert('Video saved to your account!');
  
    } catch (error) {
      console.error('Error uploading to Supabase:', error);
    }
  };

  const recordAnother = () => {
    setSelectedTake(null);
    setTimeRemaining(60);
    
    // Reconnect stream
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  };

  const selectTake = (take) => {
    setSelectedTake(take);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      takes.forEach(t => URL.revokeObjectURL(t.url));
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [takes]);

  // Reconnect stream when returning to camera view
  useEffect(() => {
    if (permissionGranted && !selectedTake && streamRef.current && videoRef.current) {
      console.log('🔄 Reconnecting stream...');
      videoRef.current.srcObject = streamRef.current;
    }
  }, [permissionGranted, selectedTake]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>🎥 Multi-Take Video Recorder</h2>
          <button onClick={() => window.location.href = '/dashboard'} style={styles.dashBtn}>
            Dashboard
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {takes.length > 0 && (
          <div style={styles.counter}>
            📹 {takes.length} take{takes.length !== 1 ? 's' : ''} recorded
          </div>
        )}

        {/* PERMISSION VIEW */}
        {!permissionGranted && takes.length === 0 && (
          <div style={styles.section}>
            <p style={styles.desc}>
              Record multiple takes and choose your best one.
            </p>
            <button onClick={requestPermissions} style={styles.primaryBtn}>
              Enable Camera
            </button>
          </div>
        )}

        {/* RECORDING VIEW */}
        {permissionGranted && !selectedTake && (
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={styles.video}
            />
            
            {isRecording && (
              <div style={styles.recording}>
                <span style={styles.dot}>●</span>
                Recording: {timeRemaining}s
              </div>
            )}

            <div style={styles.controls}>
              {!isRecording ? (
                <button onClick={startRecording} style={styles.recordBtn}>
                  {takes.length > 0 ? 'Record\nAnother' : 'Start\nRecording'}
                </button>
              ) : (
                <button onClick={stopRecording} style={styles.stopBtn}>
                  Stop
                </button>
              )}
            </div>

            {takes.length > 0 && (
              <button onClick={() => selectTake(takes[takes.length - 1])} style={styles.secondaryBtn}>
                Review Takes ({takes.length})
              </button>
            )}
          </div>
        )}

        {/* PLAYBACK VIEW */}
        {selectedTake && (
          <div>
            <video src={selectedTake.url} controls style={styles.video} />
            
            <div style={styles.takeInfo}>
              <strong>Take #{takes.findIndex(t => t.id === selectedTake.id) + 1}</strong>
              <span>{selectedTake.timestamp}</span>
            </div>

            {takes.length > 1 && (
              <div style={styles.takesList}>
                <h3>All Takes:</h3>
                {takes.map((take, i) => (
                  <button
                    key={take.id}
                    onClick={() => selectTake(take)}
                    style={{
                      ...styles.takeBtn,
                      ...(selectedTake.id === take.id ? styles.takeBtnActive : {})
                    }}
                  >
                    #{i + 1} ({take.duration}s)
                  </button>
                ))}
              </div>
            )}

            <div style={styles.controls}>
              <button onClick={() => downloadTake(selectedTake)} style={styles.primaryBtn}>
                Download
              </button>
              <button onClick={recordAnother} style={styles.secondaryBtn}>
                Record Another
              </button>
            </div>

            <p style={styles.hint}>
              Next: PresentationCoach_{String(downloadCounter).padStart(3, '0')}.webm
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: '-apple-system, sans-serif',
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
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  dashBtn: {
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
  },
  counter: {
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
  section: {
    textAlign: 'center',
    padding: '20px 0',
  },
  desc: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  video: {
    width: '100%',
    minHeight: '300px',
    borderRadius: '8px',
    backgroundColor: '#000',
    marginBottom: '16px',
    display: 'block',
    objectFit: 'cover',
  },
  recording: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: '14px',
  },
  dot: {
    color: '#ff4444',
    fontSize: '20px',
    marginRight: '8px',
  },
  controls: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  primaryBtn: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  secondaryBtn: {
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
  recordBtn: {
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
  stopBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  takeInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  takesList: {
    marginBottom: '16px',
  },
  takeBtn: {
    backgroundColor: '#f8f9fa',
    border: '2px solid transparent',
    borderRadius: '8px',
    padding: '8px 16px',
    margin: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  takeBtnActive: {
    backgroundColor: '#e3f2fd',
    border: '2px solid #007bff',
  },
  hint: {
    fontSize: '14px',
    color: '#666',
    marginTop: '16px',
    textAlign: 'center',
  },
};

export default MultiTakeVideoRecorder;
