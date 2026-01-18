import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import Modal from '../components/Modal/Modal';
import './ProjectDetails.css';

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, addMilestone, addRisk } = useProjects();
  const project = getProject(projectId);

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ name: '', dueDate: '', status: 'Not Started' });
  const [newRisk, setNewRisk] = useState({ title: '', severity: 'Medium', mitigation: '' });

  if (!project) {
    return (
      <div className="project-details">
        <div className="not-found">
          <h2>Project not found</h2>
          <button onClick={() => navigate('/projects')}>Back to Projects</button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatBudget = (budget) => {
    if (typeof budget === 'number') {
      return `€${budget.toLocaleString('de-DE')}`;
    }
    return budget;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'On Track':
        return 'status-on-track';
      case 'At Risk':
        return 'status-at-risk';
      case 'Delayed':
        return 'status-delayed';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const getMilestoneStatusClass = (status) => {
    switch (status) {
      case 'Done':
        return 'milestone-done';
      case 'In Progress':
        return 'milestone-in-progress';
      default:
        return 'milestone-not-started';
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'High':
        return 'severity-high';
      case 'Medium':
        return 'severity-medium';
      case 'Low':
        return 'severity-low';
      default:
        return '';
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'xlsx':
        return '📊';
      case 'dwg':
        return '📐';
      case 'docx':
        return '📝';
      default:
        return '📁';
    }
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestone.name || !newMilestone.dueDate) return;
    addMilestone(project.id, newMilestone);
    setNewMilestone({ name: '', dueDate: '', status: 'Not Started' });
    setIsMilestoneModalOpen(false);
  };

  const handleAddRisk = (e) => {
    e.preventDefault();
    if (!newRisk.title) return;
    addRisk(project.id, newRisk);
    setNewRisk({ title: '', severity: 'Medium', mitigation: '' });
    setIsRiskModalOpen(false);
  };

  return (
    <div className="project-details">
      <div className="details-header">
        <button className="back-button" onClick={() => navigate('/projects')}>
          ← Back to Projects
        </button>
        <div className="header-content">
          <div className="header-left">
            <h1 className="project-title">{project.name}</h1>
            <div className="project-meta">
              <span className="meta-item">{project.client}</span>
              <span className="meta-divider">•</span>
              <span className="meta-item">{project.location}</span>
              <span className="meta-divider">•</span>
              <span className={`status-badge ${getStatusClass(project.status)}`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="details-content">
        <div className="details-grid">
          <div className="main-column">
            {/* Project Overview */}
            <section className="details-section">
              <h2 className="section-title">Project Overview</h2>
              <div className="overview-card">
                <div className="overview-grid">
                  <div className="overview-item">
                    <span className="overview-label">Client</span>
                    <span className="overview-value">{project.client}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Type</span>
                    <span className="overview-value">{project.type}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Location</span>
                    <span className="overview-value">{project.location || '-'}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Project Manager</span>
                    <span className="overview-value">{project.projectManager}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Start Date</span>
                    <span className="overview-value">{formatDate(project.startDate)}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Target End Date</span>
                    <span className="overview-value">{formatDate(project.targetEndDate)}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Budget</span>
                    <span className="overview-value budget-value">{formatBudget(project.budget)}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Status</span>
                    <span className={`status-badge ${getStatusClass(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                {project.scopeSummary && (
                  <div className="scope-summary">
                    <span className="overview-label">Scope Summary</span>
                    <p className="scope-text">{project.scopeSummary}</p>
                  </div>
                )}
                {project.constraints && project.constraints.length > 0 && (
                  <div className="constraints-section">
                    <span className="overview-label">Key Constraints</span>
                    <div className="constraints-list">
                      {project.constraints.map((constraint, index) => (
                        <span key={index} className="constraint-badge">
                          {constraint}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Timeline / Milestones */}
            <section className="details-section">
              <div className="section-header">
                <h2 className="section-title">Timeline / Milestones</h2>
                <button
                  className="btn-add"
                  onClick={() => setIsMilestoneModalOpen(true)}
                >
                  + Add Milestone
                </button>
              </div>
              <div className="milestones-card">
                {project.milestones && project.milestones.length > 0 ? (
                  <div className="milestones-list">
                    {project.milestones.map((milestone) => (
                      <div key={milestone.id} className="milestone-row">
                        <div className={`milestone-status-dot ${getMilestoneStatusClass(milestone.status)}`} />
                        <div className="milestone-info">
                          <span className="milestone-name">{milestone.name}</span>
                          <span className="milestone-date">{formatDate(milestone.dueDate)}</span>
                        </div>
                        <span className={`milestone-badge ${getMilestoneStatusClass(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No milestones defined yet.</p>
                )}
              </div>
            </section>

            {/* Risks */}
            <section className="details-section">
              <div className="section-header">
                <h2 className="section-title">Risks</h2>
                <button
                  className="btn-add"
                  onClick={() => setIsRiskModalOpen(true)}
                >
                  + Add Risk
                </button>
              </div>
              <div className="risks-card">
                {project.risks && project.risks.length > 0 ? (
                  <div className="risks-list">
                    {project.risks.map((risk) => (
                      <div key={risk.id} className="risk-row">
                        <div className="risk-header">
                          <span className="risk-title">{risk.title}</span>
                          <span className={`severity-badge ${getSeverityClass(risk.severity)}`}>
                            {risk.severity}
                          </span>
                        </div>
                        {risk.mitigation && (
                          <p className="risk-mitigation">
                            <strong>Mitigation:</strong> {risk.mitigation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No risks identified yet.</p>
                )}
              </div>
            </section>
          </div>

          <div className="side-column">
            {/* Files / Documents */}
            <section className="details-section">
              <div className="section-header">
                <h2 className="section-title">Files / Documents</h2>
                <button className="btn-add btn-add-small">Upload</button>
              </div>
              <div className="documents-card">
                {project.documents && project.documents.length > 0 ? (
                  <div className="documents-list">
                    {project.documents.map((doc) => (
                      <div key={doc.id} className="document-row">
                        <span className="document-icon">{getFileIcon(doc.type)}</span>
                        <span className="document-name">{doc.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No documents uploaded yet.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Add Milestone Modal */}
      <Modal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        title="Add Milestone"
        size="small"
      >
        <form className="add-form" onSubmit={handleAddMilestone}>
          <div className="form-group">
            <label>Milestone Name</label>
            <input
              type="text"
              value={newMilestone.name}
              onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
              placeholder="e.g., Foundation pour"
              required
            />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={newMilestone.dueDate}
              onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={newMilestone.status}
              onChange={(e) => setNewMilestone({ ...newMilestone, status: e.target.value })}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsMilestoneModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">Add Milestone</button>
          </div>
        </form>
      </Modal>

      {/* Add Risk Modal */}
      <Modal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        title="Add Risk"
        size="medium"
      >
        <form className="add-form" onSubmit={handleAddRisk}>
          <div className="form-group">
            <label>Risk Title</label>
            <input
              type="text"
              value={newRisk.title}
              onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
              placeholder="e.g., Permit approval delay"
              required
            />
          </div>
          <div className="form-group">
            <label>Severity</label>
            <select
              value={newRisk.severity}
              onChange={(e) => setNewRisk({ ...newRisk, severity: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Mitigation</label>
            <textarea
              value={newRisk.mitigation}
              onChange={(e) => setNewRisk({ ...newRisk, mitigation: e.target.value })}
              placeholder="Describe mitigation strategy..."
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsRiskModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">Add Risk</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProjectDetails;
