import { useNavigate } from 'react-router-dom';
import '../styles/help.css';

export default function Help() {
  const navigate = useNavigate();

  // TODO: replace with the real support inbox before shipping
  const supportEmail = 'support@presentationcoach.example';

  return (
    <div className="help">
      <div className="help-inner">
        <button className="help-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <div className="help-header">
          <p className="help-label">Support</p>
          <h1 className="help-title">Help & Troubleshooting</h1>
          <p className="help-subtitle">
            We're still building this out — here's how to get in touch in the meantime.
          </p>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">📬 Contact us</h2>
          <p className="help-card-text">
            Found a bug, have a feature request, or just need a hand? Drop us a note:
          </p>
          <a className="help-email" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
        </div>

        <div className="help-card">
          <h2 className="help-card-title">📖 Coming soon</h2>
          <p className="help-card-text">
            A full troubleshooting guide with camera/mic setup tips, browser compatibility notes,
            and answers to common questions is on the way.
          </p>
        </div>

        <button className="help-dashboard-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
