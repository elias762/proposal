import './MilestonesList.css';

function MilestonesList({ milestones }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getDaysUntil = (dateStr) => {
    const today = new Date();
    const target = new Date(dateStr);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="milestones-list">
      {milestones.map((milestone) => {
        const daysUntil = getDaysUntil(milestone.date);
        return (
          <div key={milestone.id} className="milestone-item">
            <div className="milestone-indicator">
              <div className="milestone-dot"></div>
              <div className="milestone-line"></div>
            </div>
            <div className="milestone-content">
              <div className="milestone-header">
                <span className="milestone-title">{milestone.title}</span>
                <span className="milestone-countdown">
                  {daysUntil <= 0 ? 'Oggi' : `tra ${daysUntil}g`}
                </span>
              </div>
              <div className="milestone-meta">
                <span className="milestone-date">{formatDate(milestone.date)}</span>
                <span className="milestone-divider">·</span>
                <span className="milestone-project">{milestone.project}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MilestonesList;
