import React, { useState, useRef, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Teleprompter from './Teleprompter';

console.log('🔥 VIDEO RECORDER WITH INTEGRATED TELEPROMPTER');

const MultiTakeVideoRecorder = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const scriptFromGenerator = location.state?.script?.script_text || location.state?.script || '';

  
  const [isRecording, setIsRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [countdown, setCountdown] = useState(null);
  const [error, setError] = useState(null);
  const [takes, setTakes] = useState([]);
  const [selectedTake, setSelectedTake] = useState(null);
  const [downloadCounter, setDownloadCounter] = useState(1);
  const [script, setScript] = useState(typeof scriptFromGenerator === 'string' ? scriptFromGenerator : scriptFromGenerator?.script_text || '');
  const [showTeleprompter, setShowTeleprompter] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('presentationCoachCounter');
    if (saved) setDownloadCounter(parseInt(saved));
  }, []);

  const requestPermissions = async () => {
    console.log('🎥 Requesting camera...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: true
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(e => console.error('Play failed:', e));
          }
        }, 100);
      }
      
      setPermissionGranted(true);
      setError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Camera access denied');
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCountdown(null);
          startRecordingNow();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = () => {
    if (script) {
      // If there's a script, show teleprompter and start countdown
      setShowTeleprompter(true);
      startCountdown();
    } else {
      // No script, just start recording immediately
      startRecordingNow();
    }
  };

  const startRecordingNow = () => {
    if (!streamRef.current) return;
    
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
      
      setTakes(prev => [...prev, {
        id: Date.now(),
        url,
        blob,
        timestamp: new Date().toLocaleString(),
        duration: 60 - timeRemaining
      }]);
      
      setShowTeleprompter(false);
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
      setShowTeleprompter(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const downloadTake = (take) => {
    const userName = user?.user_metadata?.name || 
                     user?.email?.split('@')[0] || 
                     'User';
    
    const filename = `PresentationCoach_${userName}_${String(downloadCounter).padStart(3, '0')}.webm`;
    const a = document.createElement('a');
    a.href = take.url;
    a.download = filename;
    a.click();
    
    const newCounter = downloadCounter + 1;
    setDownloadCounter(newCounter);
    localStorage.setItem('presentationCoachCounter', newCounter.toString());
  };

  const recordAnother = () => {
    setSelectedTake(null);
    setTimeRemaining(60);
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  };

  const selectTake = (take) => {
    setSelectedTake(take);
  };

  const handleCloseTeleprompter = () => {
    // Stop recording if it's happening
    if (isRecording) {
      stopRecording();
    }
    setShowTeleprompter(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      takes.forEach(t => URL.revokeObjectURL(t.url));
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [takes]);

  useEffect(() => {
    if (permissionGranted && !selectedTake && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [permissionGranted, selectedTake]);

  useEffect(() => {
    if (showTeleprompter && streamRef.current && videoRef.current) {
      console.log('🔗 Reconnecting stream to corner video...');
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.error('Play error:', e));
    }
  }, [showTeleprompter]);

  // TELEPROMPTER OVERLAY WITH CAMERA
  if (showTeleprompter && script) {
    return (
      <div style={styles.teleprompterWrapper}>
        {/* Small video preview in corner */}
        <div style={styles.videoCorner}>
  <video
    ref={videoRef}
    autoPlay
    playsInline
    muted
    style={styles.videoPreview}
    key="teleprompter-video"
  />
          
          {/* Countdown overlay */}
          {countdown !== null && (
            <div style={styles.countdownOverlay}>
              <div style={styles.countdownNumber}>{countdown}</div>
              <div style={styles.countdownText}>Get ready...</div>
            </div>
          )}
          
          {/* Recording indicator */}
          {isRecording && (
            <div style={styles.recordingBadge}>
              <span style={styles.recDot}>●</span>
              {timeRemaining}s
            </div>
          )}
        </div>

        {/* Stop button */}
        {isRecording && (
          <button onClick={stopRecording} style={styles.stopFloating}>
            ⏹ Stop Recording
          </button>
        )}

        {/* Actual Teleprompter Component */}
        <Teleprompter 
          script={script} 
          onClose={handleCloseTeleprompter}
        />
      </div>
    );
  }

  // NORMAL RECORDER VIEW
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

        {!permissionGranted && takes.length === 0 && (
          <div style={styles.section}>
            <p style={styles.desc}>
              Record multiple takes and choose your best one.
              {script && ' Your script will appear as a teleprompter while recording.'}
            </p>
            {script && (
  <div style={styles.scriptPreview}>
    <strong>📜 Your Script is Ready</strong>
    <div style={styles.scriptPreviewText}>
      {typeof script === 'string' ? script.substring(0, 150) : JSON.stringify(script).substring(0, 150)}...
    </div>
    <div style={styles.scriptHint}>
      💡 The teleprompter will appear when you start recording
    </div>
  </div>
)}
            <button onClick={requestPermissions} style={styles.primaryBtn}>
              Enable Camera
            </button>
          </div>
        )}

        {permissionGranted && !selectedTake && (
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={styles.video}
            />

            <div style={styles.controls}>
              {!isRecording && countdown === null ? (
                <button onClick={startRecording} style={styles.recordBtn}>
                  {takes.length > 0 ? 'Record\nAnother' : 'Start\nRecording'}
                </button>
              ) : !showTeleprompter && isRecording ? (
                <button onClick={stopRecording} style={styles.stopBtn}>
                  Stop
                </button>
              ) : null}
            </div>

            {script && !isRecording && (
              <div style={styles.teleprompterInfo}>
                📜 Teleprompter will appear in 3 seconds after you click "Start Recording"
              </div>
            )}

            {takes.length > 0 && !isRecording && countdown === null && (
              <button onClick={() => selectTake(takes[takes.length - 1])} style={styles.secondaryBtn}>
                Review Takes ({takes.length})
              </button>
            )}
          </div>
        )}

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
              Next: PresentationCoach_{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}_{String(downloadCounter).padStart(3, '0')}.webm
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
  scriptPreview: {
    backgroundColor: '#FFF8F0',
    border: '2px solid #FFE0B2',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'left',
  },
  scriptPreviewText: {
    marginTop: '8px',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    fontStyle: 'italic',
  },
  scriptHint: {
    fontSize: '13px',
    color: '#FF9500',
    fontWeight: '600',
    marginTop: '12px',
  },
  teleprompterInfo: {
    backgroundColor: '#FFF8F0',
    border: '1px solid #FFE0B2',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#FF9500',
    fontWeight: '600',
  },
  video: {
    width: '100%',
    minHeight: '300px',
    borderRadius: '8px',
    backgroundColor: '#000',
    marginBottom: '16px',
    display: 'block',
    objectFit: 'cover',
    transform: 'scaleX(-1)',
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

  // TELEPROMPTER OVERLAY STYLES
  teleprompterWrapper: {
    position: 'relative',
  },
  videoCorner: {
    position: 'fixed',
    top: '80px',
    right: '20px',
    width: '240px',
    zIndex: 10001,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    border: '2px solid rgba(255,255,255,0.1)',
  },
  videoPreview: {
    width: '100%',
    height: 'auto',
    display: 'block',
    transform: 'scaleX(-1)',
    backgroundColor: '#000',
  },
  countdownOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumber: {
    fontSize: '72px',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 0 20px rgba(255,149,0,0.8)',
  },
  countdownText: {
    fontSize: '16px',
    color: '#fff',
    marginTop: '8px',
  },
  recordingBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  recDot: {
    color: '#ff4444',
    fontSize: '16px',
  },
  stopFloating: {
    position: 'fixed',
    bottom: '120px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '16px 40px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 6px 28px rgba(220,53,69,0.6)',
    zIndex: 10002,
  },
};

export default MultiTakeVideoRecorder;
