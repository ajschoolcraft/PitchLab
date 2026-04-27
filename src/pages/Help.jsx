/**
 * @fileoverview Help and troubleshooting page.
 * Provides practical guidance on camera/mic setup, recording tips, script
 * generator best practices, browser compatibility, and frequently asked
 * questions. Includes a support email contact for additional assistance.
 */

import { useNavigate } from 'react-router-dom';
import '../styles/help.css';

export default function Help() {
  const navigate = useNavigate();

  const supportEmail = 'support@presentationcoach.example';

  const faqs = [
    {
      q: 'How long can my recordings be?',
      a: 'Each take can be up to 60 seconds. You can record as many takes as you like and pick your best one.',
    },
    {
      q: 'What format are downloaded videos?',
      a: 'Videos are saved as .webm files, which work on most devices and platforms. If a platform requires .mp4, you can use a free converter like CloudConvert.',
    },
    {
      q: 'Can I edit my script after generating it?',
      a: 'Yes! After your script is generated, you can copy it and paste it into the teleprompter on the Record page, where you can edit it freely before recording.',
    },
    {
      q: 'Is my data private?',
      a: 'Your videos and scripts are stored securely in your account. Only you can access them unless you choose to share.',
    },
  ];

  return (
    <div className="help">
      <div className="help-inner">
        <button className="help-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="help-header">
          <p className="help-label">Support</p>
          <h1 className="help-title">Help & Tips</h1>
          <p className="help-subtitle">
            Everything you need to get the most out of PitchLab.
          </p>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">📷 Camera & Microphone Setup</h2>
          <ul className="help-list">
            <li>When prompted, tap <strong>Allow</strong> to give the app access to your camera and microphone.</li>
            <li>If you accidentally blocked access, go to your browser settings → Site Settings → Camera/Microphone and set it to <strong>Allow</strong>.</li>
            <li>On iPhone, use <strong>Safari</strong> for the best recording experience. On Android, use <strong>Chrome</strong>.</li>
            <li>On a laptop, any modern browser (Chrome, Edge, Firefox, Safari) will work.</li>
            <li>Make sure no other app is using your camera (Zoom, FaceTime, etc.) before recording.</li>
          </ul>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">🎬 Recording Tips</h2>
          <ul className="help-list">
            <li><strong>Lighting:</strong> Face a window or light source so your face is well-lit. Avoid having bright light behind you.</li>
            <li><strong>Audio:</strong> Record in a quiet space. Even a closet works great for reducing echo.</li>
            <li><strong>Framing:</strong> Position the camera at eye level. Keep your head and shoulders in frame.</li>
            <li><strong>Eye contact:</strong> Look at the camera lens, not the screen. This creates a natural connection with your audience.</li>
            <li><strong>Teleprompter:</strong> Paste your script into the teleprompter before recording. It scrolls on screen so you never lose your place.</li>
            <li><strong>Multiple takes:</strong> Don't aim for perfection on the first try. Record 3-5 takes and pick the best one.</li>
          </ul>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">✍️ Script Generator Tips</h2>
          <ul className="help-list">
            <li>Answer each question in your own words — the more detail you give, the more authentic your script will sound.</li>
            <li>Don't worry about grammar or polish in your answers. The AI will clean it up.</li>
            <li>After generating, read through the script out loud. If anything doesn't sound like you, edit it.</li>
            <li>You can generate multiple scripts and pick the one that feels right.</li>
          </ul>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">❓ Frequently Asked Questions</h2>
          <div className="help-faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="help-faq">
                <h3 className="help-faq-q">{faq.q}</h3>
                <p className="help-faq-a">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">🌐 Browser Compatibility</h2>
          <ul className="help-list">
            <li><strong>Best on mobile:</strong> Safari (iOS), Chrome (Android)</li>
            <li><strong>Best on desktop:</strong> Chrome, Edge, Firefox, Safari</li>
            <li>Internet Explorer is not supported.</li>
            <li>If recording doesn't start, try updating your browser to the latest version.</li>
          </ul>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">📬 Still Need Help?</h2>
          <p className="help-card-text">
            Found a bug or have a feature request? We'd love to hear from you.
          </p>
          <a className="help-email" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
        </div>

        <button className="help-dashboard-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
