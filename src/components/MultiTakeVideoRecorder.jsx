/**
 * @fileoverview Multi-take video recorder component.
 * Handles camera/microphone access, MediaRecorder-based video capture with a
 * 60-second timer, thumbnail generation, and automatic upload to Supabase Storage.
 * Supports multiple takes per session — users can review, delete, re-record, and
 * download individual takes. Integrates with the Teleprompter overlay when a
 * script is provided.
 */

import React, { useState, useRef, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Teleprompter from './Teleprompter';
import CoachingFeedback from './CoachingFeedback';
import '../styles/recorder.css';

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

        const takeId = Date.now();
        const newTake = {
          id: takeId,
          url,
          blob,
          timestamp: new Date().toLocaleString(),
          duration,
          saveStatus: 'pending',
          dbId: null,
          saveError: null,
        };

        setTakes(prev => [...prev, newTake]);

        // Fire-and-forget upload — UI stays responsive, next take can start immediately.
        saveTakeToSupabase(newTake)
          .then(({ dbId }) => {
            setTakes(prev => prev.map(t =>
              t.id === takeId
                ? { ...t, saveStatus: 'saved', dbId, saveError: null }
                : t
            ));
          })
          .catch(err => {
            console.error('Auto-save failed:', err);
            setTakes(prev => prev.map(t =>
              t.id === takeId
                ? { ...t, saveStatus: 'failed', saveError: err.message }
                : t
            ));
          });

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

  const generateThumbnail = (videoUrl) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoUrl;
      video.muted = true;
      video.onloadeddata = () => {
        video.currentTime = 0.1;
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob returned null'));
          },
          'image/jpeg',
          0.7
        );
      };
      video.onerror = () => reject(new Error('Video load failed'));
    });
  };

  const saveTakeToSupabase = async (take) => {
    if (!user) {
      throw new Error('User not logged in');
    }

    // Convert blob URL to actual blob
    const response = await fetch(take.url);
    const blob = await response.blob();

    // Generate unique video ID
    const videoId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const storagePath = `${user.id}/${videoId}.webm`;

    // Upload video
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(storagePath, blob);

    if (uploadError) {
      throw new Error(`Video upload failed: ${uploadError.message}`);
    }

    // Generate + upload thumbnail (non-fatal — log and continue on failure)
    let thumbnailUrl = null;
    try {
      const thumbBlob = await generateThumbnail(take.url);
      const thumbPath = `${user.id}/${videoId}.jpg`;
      const { error: thumbUploadError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbPath, thumbBlob);

      if (thumbUploadError) {
        console.error('Thumbnail upload error:', thumbUploadError);
      } else {
        const { data: thumbUrlData } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(thumbPath);
        thumbnailUrl = thumbUrlData?.publicUrl || null;
      }
    } catch (thumbErr) {
      console.error('Thumbnail generation error:', thumbErr);
    }

    // Insert DB row
    const { data: dbData, error: dbError } = await supabase
      .from('user_vids')
      .insert({
        user_id: user.id,
        script_id: scriptData?.id || null,
        storage_path: storagePath,
        thumbnail_url: thumbnailUrl,
        duration_secs: Math.round(take.duration || 0),
        final_size_bytes: blob.size,
        status: 'draft',
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database insert failed: ${dbError.message}`);
    }

    return { dbId: dbData.id, thumbnailUrl, storagePath };
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

  const retrySaveTake = (take) => {
    setTakes(prev => prev.map(t =>
      t.id === take.id
        ? { ...t, saveStatus: 'pending', saveError: null }
        : t
    ));
    saveTakeToSupabase(take)
      .then(({ dbId }) => {
        setTakes(prev => prev.map(t =>
          t.id === take.id
            ? { ...t, saveStatus: 'saved', dbId, saveError: null }
            : t
        ));
      })
      .catch(err => {
        console.error('Retry save failed:', err);
        setTakes(prev => prev.map(t =>
          t.id === take.id
            ? { ...t, saveStatus: 'failed', saveError: err.message }
            : t
        ));
      });
  };

  const deleteTake = async (take) => {
    if (!window.confirm('Delete this take? This cannot be undone.')) return;

    if (take.saveStatus === 'saved' && take.dbId) {
      try {
        // Look up the storage path from the DB row (stored at insert time)
        const { data: row, error: fetchErr } = await supabase
          .from('user_vids')
          .select('storage_path, thumbnail_url')
          .eq('id', take.dbId)
          .single();

        if (!fetchErr && row?.storage_path) {
          await supabase.storage.from('videos').remove([row.storage_path]);
        }
        if (!fetchErr && row?.thumbnail_url) {
          // thumbnail_url is a public URL — derive the path by taking the last two segments
          const match = row.thumbnail_url.match(/thumbnails\/(.+)$/);
          if (match && match[1]) {
            await supabase.storage.from('thumbnails').remove([match[1]]);
          }
        }

        const { error: delErr } = await supabase
          .from('user_vids')
          .delete()
          .eq('id', take.dbId);
        if (delErr) {
          console.error('DB delete failed:', delErr);
          alert('Could not delete from your account. Please try again.');
          return;
        }
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Could not delete from your account. Please try again.');
        return;
      }
    }

    // Remove from local state + revoke blob URL
    URL.revokeObjectURL(take.url);
    setTakes(prev => {
      const remaining = prev.filter(t => t.id !== take.id);
      return remaining;
    });
    setSelectedTake(prev =>
      prev?.id === take.id ? null : prev
    );
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
        <div className="recorder-tp-wrapper"></div>

        <div className="recorder-video-corner">
          <video ref={videoRef} autoPlay playsInline muted />

          {countdown !== null && (
            <div className="recorder-countdown-overlay">
              <div className="recorder-countdown-number">{countdown}</div>
              <div className="recorder-countdown-text">Get ready...</div>
            </div>
          )}

          {isRecording && (
            <div className="recorder-recording-badge">
              <span className="recorder-rec-dot">●</span> {timeRemaining}s
            </div>
          )}
        </div>

        {isRecording && (
          <button onClick={stopRecording} className="recorder-stop-floating">
            ⏹ Stop
          </button>
        )}

        <Teleprompter script={script} onClose={() => { stopRecording(); setShowTeleprompter(false); }} />
      </>
    );
  }

  // NORMAL VIEW
  return (
    <div className="recorder-card">
      <div className="recorder-header">
        <h2 className="recorder-title">🎥 Multi-Take Video Recorder</h2>
      </div>

      {error && <div className="error-box">{error}</div>}

      {takes.length > 0 && (
        <div className="recorder-counter">
          📹 {takes.length} take{takes.length !== 1 ? 's' : ''} recorded
        </div>
      )}

      {!permissionGranted && takes.length === 0 && (
        <div className="recorder-section">
          <p className="recorder-desc">Record multiple takes and choose your best one.</p>
          {script && (
            <div className="recorder-script-preview">
              <strong>📜 Script Ready</strong>
              <p>{script.substring(0, 150)}...</p>
            </div>
          )}
          <button onClick={requestPermissions} className="btn-primary">
            Enable Camera
          </button>
        </div>
      )}

      {permissionGranted && !selectedTake && (
        <div>
          <video ref={videoRef} autoPlay playsInline muted className="recorder-video" />

          {isRecording && (
            <div className="recorder-recording">
              <span className="recorder-dot">●</span> Recording: {timeRemaining}s
            </div>
          )}

          <div className="recorder-controls">
            {!isRecording ? (
              <button onClick={startRecording} className="recorder-record-btn">
                {takes.length > 0 ? 'Record\nAnother' : 'Start\nRecording'}
              </button>
            ) : (
              <button onClick={stopRecording} className="recorder-stop-btn">
                Stop
              </button>
            )}
          </div>

          {takes.length > 0 && (
            <button onClick={() => selectTake(takes[takes.length - 1])} className="btn-secondary" style={{ width: '100%' }}>
              Review Takes ({takes.length})
            </button>
          )}
        </div>
      )}

      {selectedTake && (
        <div>
          <video src={selectedTake.url} controls className="recorder-video-playback" />

          <div className="recorder-take-info">
            <strong>Take #{takes.findIndex(t => t.id === selectedTake.id) + 1}</strong>
            <span>{selectedTake.timestamp}</span>
          </div>

          <CoachingFeedback
            take={{ ...selectedTake, takeNumber: takes.findIndex(t => t.id === selectedTake.id) + 1 }}
            script={script}
          />

          {takes.length > 0 && (
            <div className="recorder-takes-list">
              <h3>All Takes:</h3>
              {takes.map((take, i) => {
                const isActive = selectedTake.id === take.id;
                return (
                  <div
                    key={take.id}
                    className={`recorder-take-row ${isActive ? 'recorder-take-row-active' : ''}`}
                  >
                    <div
                      className="recorder-take-main"
                      role="button"
                      tabIndex={0}
                      onClick={() => selectTake(take)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectTake(take); } }}
                    >
                      <video
                        className="recorder-take-thumb"
                        src={take.url}
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="recorder-take-meta">
                        <div className="recorder-take-title">
                          Take #{i + 1} · {take.duration}s
                        </div>
                        {take.saveStatus === 'pending' && (
                          <div className="recorder-take-status recorder-take-status-pending">
                            ⟳ Saving…
                          </div>
                        )}
                        {take.saveStatus === 'saved' && (
                          <div className="recorder-take-status recorder-take-status-saved">
                            ✓ Saved
                          </div>
                        )}
                        {take.saveStatus === 'failed' && (
                          <button
                            type="button"
                            className="recorder-take-status recorder-take-status-failed"
                            onClick={(e) => {
                              e.stopPropagation();
                              retrySaveTake(take);
                            }}
                            title={take.saveError || 'Upload failed'}
                          >
                            ⚠ Failed — retry
                          </button>
                        )}
                      </div>
                    </div>
                    <button
                      className="recorder-take-delete"
                      onClick={() => deleteTake(take)}
                      aria-label={`Delete take ${i + 1}`}
                    >
                      🗑
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="recorder-controls">
            <button onClick={() => downloadTake(selectedTake)} className="btn-primary">
              Download
            </button>
            <button onClick={recordAnother} className="btn-secondary">
              Record Another
            </button>
          </div>

          <p className="recorder-hint">
            Next: PresentationCoach_{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}_{String(downloadCounter).padStart(3, '0')}.webm
          </p>
        </div>
      )}
    </div>
  );
};



export default MultiTakeVideoRecorder;