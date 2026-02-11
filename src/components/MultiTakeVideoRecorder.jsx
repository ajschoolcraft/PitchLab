import React, { useState, useRef, useEffect } from 'react';

const MultiTakeVideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [error, setError] = useState(null);
  const [takes, setTakes] = useState([]); // Array of recorded takes
  const [selectedTake, setSelectedTake] = useState(null);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [downloadCounter, setDownloadCounter] = useState(1);

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
      videoBitsPerSecon: 2500000
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
        
        // Add new take to the list
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

  // Download a specific take
  const downloadTake = (take, showPrompt = true) => {
    if (showPrompt && takes.length > 1) {
      setSelectedTake(take);
      setShowDeletePrompt(true);
      return;
    }

    // Generate filename: PresentationCoach_001.webm
    const filename = `PresentationCoach_${String(downloadCounter).padStart(3, '0')}.webm`;
    
    const a = document.createElement('a');
    a.href = take.url;
    a.download = filename;
    a.click();

    // Increment and save counter
    const newCounter = downloadCounter + 1;
    setDownloadCounter(newCounter);
    localStorage.setItem('presentationCoachCounter', newCounter.toString());
  };

  // Download and delete other takes
  const downloadAndDeleteOthers = () => {
    if (!selectedTake) return;

    // Download the selected take
    downloadTake(selectedTake, false);

    // Delete all other takes
    takes.forEach(take => {
      if (take.id !== selectedTake.id) {
        URL.revokeObjectURL(take.url);
      }
    });

    // Keep only the downloaded take
    setTakes([selectedTake]);
    setShowDeletePrompt(false);
  };

  // Download and keep all takes
  const downloadAndKeepRecording = () => {
    if (!selectedTake) return;
    
    downloadTake(selectedTake, false);
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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎥 Multi-Take Video Recorder</h2>
        
        {error && (
          <div style={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {/* Takes Counter */}
        {takes.length > 0 && (
          <div style={styles.takesCounter}>
            📹 {takes.length} take{takes.length !== 1 ? 's' : ''} recorded
          </div>
        )}

        {/* Permission Section */}
        {!permissionGranted && takes.length === 0 && (
          <div style={styles.permissionSection}>
            <p style={styles.description}>
              Record multiple takes and choose your best one. 
              Videos are stored temporarily until you download or close this page.
            </p>
            <button onClick={requestPermissions} style={styles.primaryButton}>
              Enable Camera
            </button>
          </div>
        )}

        {/* Recording Section */}
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

        {/* Playback Section with Takes List */}
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

            {/* All Takes List */}
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
                Download This Take
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
            </p>
          </div>
        )}

        {/* Delete Prompt Modal */}
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
          ⚠️ All takes deleted when you close this tab
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
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
