import './Header.css';

function Header({ title, subtitle }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-titles">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        <div className="header-actions">
          <button className="header-btn header-btn-secondary">
            <span>🔔</span>
          </button>
          <button className="header-btn header-btn-primary">
            + New Project
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
