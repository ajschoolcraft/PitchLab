/**
 * @fileoverview Video library page.
 * Fetches and displays all of the user's saved recordings in a responsive grid.
 * Supports playback, downloading, marking recordings as "final", and deletion
 * (from both Supabase Storage and the database). Can deep-link to a specific
 * recording via location state from the Dashboard.
 */

import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import '../styles/recordings.css';

export default function Recordings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [recordings, setRecordings] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [shareUrl, setShareUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchRecordings();
  }, [user]);

  useEffect(() => {
    // If navigated with a specific recording ID
    const recordingId = location.state?.recordingId;
    if (recordingId && recordings.length > 0) {
      const recording = recordings.find(r => r.id === recordingId);
      if (recording) {
        selectRecording(recording);
      }
    }
  }, [location.state, recordings]);

  const fetchRecordings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_vids')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRecordings(data || []);
    } catch (err) {
      console.error('Error fetching recordings:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectRecording = async (recording) => {
    setSelectedRecording(recording);
    setShareUrl(null);
    setCopied(false);

    // Fetch video from Supabase storage
    try {
      const { data, error } = await supabase.storage
        .from('videos')
        .download(recording.storage_path);

      if (error) {
        console.error('Download error:', error);
        alert('Error loading video');
        return;
      }

      const url = URL.createObjectURL(data);
      setVideoUrl(url);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to load video');
    }
  };

  const downloadRecording = async (recording) => {
    try {
      const { data, error } = await supabase.storage
        .from('videos')
        .download(recording.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PresentationCoach_Recording_${recording.id}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download video');
    }
  };

  const generateShareUrl = (recording) => {
    const { data } = supabase.storage
      .from('videos')
      .getPublicUrl(recording.storage_path);

    setShareUrl(data.publicUrl);
    setCopied(false);
  };

  const copyShareUrl = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const toggleFinalStatus = async (recording) => {
    const newStatus = recording.status === 'final' ? 'draft' : 'final';
    
    try {
      const { error } = await supabase
        .from('user_vids')
        .update({ status: newStatus })
        .eq('id', recording.id);

      if (error) throw error;

      setRecordings(recordings.map(r =>
        r.id === recording.id ? { ...r, status: newStatus } : r
      ));

      if (selectedRecording?.id === recording.id) {
        setSelectedRecording({ ...selectedRecording, status: newStatus });
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update status');
    }
  };

  const deleteRecording = async (recording) => {
    if (!window.confirm('Delete this recording? This cannot be undone.')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([recording.storage_path]);

      if (storageError) console.error('Storage delete error:', storageError);

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_vids')
        .delete()
        .eq('id', recording.id);

      if (dbError) throw dbError;

      setRecordings(recordings.filter(r => r.id !== recording.id));
      
      if (selectedRecording?.id === recording.id) {
        setSelectedRecording(null);
        setVideoUrl(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete recording');
    }
  };

  if (loading) {
    return (
      <div className="recordings">
        <div className="recordings-inner">
          <div className="loading">Loading your recordings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="recordings">
      <div className="recordings-inner">
        <button className="recordings-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="recordings-header">
          <p className="recordings-label">Video Library</p>
          <h1 className="recordings-title">My Recordings</h1>
          <p className="recordings-subtitle">
            {recordings.length} recording{recordings.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {recordings.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎤</span>
            <h2>Record your first take</h2>
            <p>Practice makes perfect — record, review, and improve your delivery</p>
            <button className="btn-primary" onClick={() => navigate('/record')}>
              🎥 Start Recording
            </button>
          </div>
        ) : !selectedRecording ? (
          <div className="recordings-grid">
            {recordings.map((recording, index) => (
              <div key={recording.id} className="recording-card">
                {recording.thumbnail_url ? (
                  <img src={recording.thumbnail_url} alt="Thumbnail" className="recording-thumb" />
                ) : (
                  <div className="recording-thumb-placeholder">🎥</div>
                )}
                
                <div className="recording-info">
                  <h3>
                    {recording.status === 'final' && <span className="final-badge">⭐</span>}
                    Recording #{recordings.length - index}
                  </h3>
                  <p className="recording-date">
                    {new Date(recording.created_at).toLocaleDateString()} • {recording.duration_secs}s
                  </p>
                </div>

                <div className="recording-actions">
                  <button onClick={() => selectRecording(recording)} className="btn-view">
                    View
                  </button>
                  <button 
                    onClick={() => toggleFinalStatus(recording)}
                    className={`btn-mark ${recording.status === 'final' ? 'active' : ''}`}
                  >
                    {recording.status === 'final' ? '★' : '☆'}
                  </button>
                  <button onClick={() => deleteRecording(recording)} className="btn-delete">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="playback-view">
            <button onClick={() => { setSelectedRecording(null); setVideoUrl(null); setShareUrl(null); setCopied(false); }} className="back-btn">
              ← Back to All Recordings
            </button>

            <div className="playback-container">
              {videoUrl ? (
                <video src={videoUrl} controls className="playback-video" />
              ) : (
                <div className="loading-video">Loading video...</div>
              )}

              <div className="playback-info">
                <div className="playback-header">
                  <h2>
                    {selectedRecording.status === 'final' && <span className="final-badge">⭐</span>}
                    Recording #{recordings.findIndex(r => r.id === selectedRecording.id) + 1}
                  </h2>
                  <span className="playback-date">
                    {new Date(selectedRecording.created_at).toLocaleString()} • {selectedRecording.duration_secs}s
                  </span>
                </div>

                {recordings.length > 1 && (
                  <div className="other-takes">
                    <h3>Other Recordings:</h3>
                    <div className="takes-list">
                      {recordings.map((rec, i) => (
                        <button
                          key={rec.id}
                          onClick={() => selectRecording(rec)}
                          className={`take-btn ${selectedRecording.id === rec.id ? 'active' : ''}`}
                        >
                          {rec.status === 'final' && '⭐ '}
                          #{recordings.length - i} ({rec.duration_secs}s)
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="playback-actions">
                  <button onClick={() => downloadRecording(selectedRecording)} className="btn-download">
                    Download
                  </button>
                  <button onClick={() => generateShareUrl(selectedRecording)} className="btn-share">
                    🔗 Get Video Link
                  </button>
                  <button onClick={() => navigate('/share')} className="btn-share-guide">
                    📤 Share Guide
                  </button>
                  <button
                    onClick={() => toggleFinalStatus(selectedRecording)}
                    className={`btn-final ${selectedRecording.status === 'final' ? 'active' : ''}`}
                  >
                    {selectedRecording.status === 'final' ? 'Unmark as Final' : 'Mark as Final'}
                  </button>
                </div>

                {shareUrl && (
                  <div className="share-url-section">
                    <p className="share-url-label">Video Link</p>
                    <div className="share-url-row">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="share-url-input"
                        onClick={(e) => e.target.select()}
                      />
                      <button onClick={copyShareUrl} className="btn-copy">
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="share-url-hint">
                      Paste this link anywhere to share your video — social media, messages, or email.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
