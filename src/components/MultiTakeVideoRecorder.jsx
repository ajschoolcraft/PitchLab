import React, { useState, useRef, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Teleprompter from './Teleprompter';

const MultiTakeVideoRecorder = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  // Get script
  const scriptData = location.state?.script;
  const script = typeof scriptData === 'string' ? scriptData : scriptData?.script_text || '';
  
  const [isRecording, setIsRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [error, setError] = useState(null);
  const [takes, setTakes] = useState([]);
  const [selectedTake, setSelectedTake] = useState(null);
  const [downloadCounter, setDownloadCounter] = useState(1);
  const [countdown, setCountdown] = useState(null);
  const [showTeleprompter, setShowTeleprompter] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const isStartingRef = useRef(false);
  const recordingStartTimeRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('presentationCoachCounter');
    if (saved) setDownloadCounter(parseInt(saved));
  }, []);

  const requestPermissions = async () => {
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

  const startRecording = () => {
    if (script) {
      setShowTeleprompter(true);
      setCountdown(3);
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setCountdown(null);
            startRecordingNow();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      startRecordingNow();
    }
  };

  const startRecordingNow = async () => {
    // Prevent double-start with flag
    if (isStartingRef.current) {
      console.log('⚠️ Already starting, skipping...');
      return;
    }
    isStartingRef.current = true;
    
    // Prevent double-start
    if (mediaRecorderRef.current?.state === 'recording') {
      console.log('⚠️ Already recording, skipping...');
      isStartingRef.current = false;
      return;
    }
    
    // Stop and clear any existing recorder FIRST
    if (mediaRecorderRef.current) {
      const oldRecorder = mediaRecorderRef.current;
      if (oldRecorder.state === 'recording' || oldRecorder.state === 'paused') {
        await new Promise(resolve => {
          oldRecorder.onstop = () => {
            console.log('Old recorder stopped');
            resolve();
          };
          oldRecorder.stop();
        });
      }
      mediaRecorderRef.current = null;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Always get fresh stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Could not access camera');
      return;
    }
    
    console.log('🎬 Starting recorder...');
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 2500000
    });
    
    console.log('✅ Recorder created, starting...');
    
    recorder.ondataavailable = (e) => {
      if (e.data?.size > 0) {
        console.log('📦 Chunk:', e.data.size);
        chunksRef.current.push(e.data);
      }
    };
    
    recorder.onstop = () => {
      console.log('⏹ Stopped. Chunks:', chunksRef.current.length);
      
      setTimeout(() => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        console.log('🎥 Blob size:', blob.size);
        const url = URL.createObjectURL(blob);
        
        const duration = recordingStartTimeRef.current 
          ? Math.round((Date.now() - recordingStartTimeRef.current) / 1000)
          : 0;
        
        setTakes(prev => [...prev, {
          id: Date.now(),
          url,
          blob,
          timestamp: new Date().toLocaleString(),
          duration
        }]);
        
        setShowTeleprompter(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }, 100);
    };
    
    mediaRecorderRef.current = recorder;
    recorder.start(100);
    setIsRecording(true);
    setTimeRemaining(60);
    recordingStartTimeRef.current = Date.now();
    
    isStartingRef.current = false;
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    console.log('🛑 stopRecording called. Recorder state:', mediaRecorderRef.current?.state);
    if (mediaRecorderRef.current?.state === 'recording' || mediaRecorderRef.current?.state === 'paused') {
      console.log('Stopping recorder...');
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setShowTeleprompter(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Reconnect stream to video after stopping
    setTimeout(() => {
      if (streamRef.current && videoRef.current && !selectedTake) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play();
      }
    }, 100);
  };

  const downloadTake = (take) => {
    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
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
    // Clear old recorder
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    
    setSelectedTake(null);
    setTimeRemaining(60);
  };

  const selectTake = (take) => {
    setSelectedTake(take);
    // Force video reload
    setTimeout(() => {
      const videoEl = document.querySelector('video[controls]');
      if (videoEl) {
        videoEl.load();
      }
    }, 50);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      takes.forEach(t => URL.revokeObjectURL(t.url));
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (permissionGranted && !selectedTake && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [permissionGranted, selectedTake]);

  useEffect(() => {
    if (showTeleprompter && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play();
    }
  }, [showTeleprompter]);

  // TELEPROMPTER OVERLAY
  if (showTeleprompter && script) {
    return (
      <>
        <style>{`
          @media (max-width: 768px) {
            .video-corner-mobile {
              width: 140px !important;
              top: 70px !important;
            }
          }
        `}</style>
        
        <div style={styles.teleprompterWrapper}></div>
        
        <div style={styles.videoCorner} className="video-corner-mobile">
          <video ref={videoRef} autoPlay playsInline muted style={styles.videoPreview} />
          
          {countdown !== null && (
            <div style={styles.countdownOverlay}>
              <div style={styles.countdownNumber}>{countdown}</div>
              <div style={styles.countdownText}>Get ready...</div>
            </div>
          )}
          
          {isRecording && (
            <div style={styles.recordingBadge}>
              <span style={styles.recDot}>●</span> {timeRemaining}s
            </div>
          )}
        </div>

        {isRecording && (
          <button onClick={stopRecording} style={styles.stopFloating}>
            ⏹ Stop
          </button>
        )}
        
        <Teleprompter script={script} onClose={() => { stopRecording(); setShowTeleprompter(false); }} />
      </>
    );
  }

  // NORMAL VIEW
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
            <p style={styles.desc}>Record multiple takes and choose your best one.</p>
            {script && (
              <div style={styles.scriptPreview}>
                <strong style={{ color: '#d4a574' }}>📜 Script Ready</strong>
                <p style={{ color: '#a0a0a0', marginTop: '8px', marginBottom: 0 }}>Your script will display on a teleprompter with your camera preview in the corner.</p>
              </div>
            )}
            <button onClick={requestPermissions} style={styles.primaryBtn}>
              Enable Camera
            </button>
          </div>
        )}

        {permissionGranted && !selectedTake && (
          <div>
            <video ref={videoRef} autoPlay playsInline muted style={styles.video} />
            
            {isRecording && (
              <div style={styles.recording}>
                <span style={styles.dot}>●</span> Recording: {timeRemaining}s
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

        {selectedTake && (
          <div>
            <video src={selectedTake.url} controls style={styles.videoPlayback} />
            
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
              <button onClick={() => window.location.href = '/share'} style={styles.shareBtn}>
                📤 Share
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
    backgroundColor: 'transparent',
    padding: '20px',
    fontFamily: '-apple-system, sans-serif',
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'none',
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
    color: '#fff',
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
    color: '#a0a0a0',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  scriptPreview: {
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    color: '#fff',
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
  videoPlayback: {
    width: '100%',
    minHeight: '300px',
    borderRadius: '8px',
    backgroundColor: '#000',
    marginBottom: '16px',
    display: 'block',
    objectFit: 'cover',
  },
  recording: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
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
  shareBtn: {
    backgroundColor: '#d4a574',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
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
    color: '#888',
    marginTop: '16px',
    textAlign: 'center',
  },
  
  // Teleprompter
  teleprompterWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    pointerEvents: 'none',
  },
  videoCorner: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '280px',
    zIndex: 10001,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    pointerEvents: 'auto',
  },
  videoPreview: {
    width: '100%',
    height: 'auto',
    display: 'block',
    transform: 'scaleX(-1)',
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumber: {
    fontSize: '60px',
    fontWeight: 'bold',
    color: '#fff',
  },
  countdownText: {
    fontSize: '14px',
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
    fontSize: '13px',
    fontWeight: '600',
  },
  recDot: {
    color: '#ff4444',
    fontSize: '14px',
  },
  stopFloating: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 6px 28px rgba(220,53,69,0.6)',
    zIndex: 10002,
    pointerEvents: 'auto',
  },
};

export default MultiTakeVideoRecorder;
