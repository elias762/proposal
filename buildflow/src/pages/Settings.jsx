import Header from '../components/Header/Header';
import './PlaceholderPage.css';

function Settings() {
  return (
    <div className="placeholder-page">
      <Header title="Settings" subtitle="Application configuration" />
      <div className="placeholder-content">
        <div className="placeholder-card">
          <div className="placeholder-icon">⚙️</div>
          <h2 className="placeholder-title">Application Settings</h2>
          <p className="placeholder-description">
            This page will contain user preferences, team management, notification settings,
            integrations configuration, and system administration options.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
