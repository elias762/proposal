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
          <h2>Progetto Non Trovato</h2>
          <button onClick={() => navigate('/projects')}>Torna ai Progetti</button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatBudget = (budget) => {
    if (typeof budget === 'number') {
      return `€${budget.toLocaleString('it-IT')}`;
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'On Track':
        return 'In Linea';
      case 'At Risk':
        return 'A Rischio';
      case 'Delayed':
        return 'In Ritardo';
      case 'Completed':
        return 'Completato';
      default:
        return status;
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

  const getMilestoneStatusLabel = (status) => {
    switch (status) {
      case 'Done':
        return 'Completato';
      case 'In Progress':
        return 'In Corso';
      case 'Not Started':
        return 'Non Iniziato';
      default:
        return status;
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

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'High':
        return 'Alto';
      case 'Medium':
        return 'Medio';
      case 'Low':
        return 'Basso';
      default:
        return severity;
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
          ← Torna ai Progetti
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
                {getStatusLabel(project.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="details-content">
        <div className="details-grid">
          <div className="main-column">
            {/* Panoramica Progetto */}
            <section className="details-section">
              <h2 className="section-title">Panoramica Progetto</h2>
              <div className="overview-card">
                <div className="overview-grid">
                  <div className="overview-item">
                    <span className="overview-label">Cliente</span>
                    <span className="overview-value">{project.client}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Tipologia</span>
                    <span className="overview-value">{project.type}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Località</span>
                    <span className="overview-value">{project.location || '-'}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Project Manager</span>
                    <span className="overview-value">{project.projectManager}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Data Inizio</span>
                    <span className="overview-value">{formatDate(project.startDate)}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Data Fine Prevista</span>
                    <span className="overview-value">{formatDate(project.targetEndDate)}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Budget</span>
                    <span className="overview-value budget-value">{formatBudget(project.budget)}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Stato</span>
                    <span className={`status-badge ${getStatusClass(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                </div>
                {project.scopeSummary && (
                  <div className="scope-summary">
                    <span className="overview-label">Descrizione Progetto</span>
                    <p className="scope-text">{project.scopeSummary}</p>
                  </div>
                )}
                {project.constraints && project.constraints.length > 0 && (
                  <div className="constraints-section">
                    <span className="overview-label">Vincoli Principali</span>
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

            {/* Cronoprogramma / Milestone */}
            <section className="details-section">
              <div className="section-header">
                <h2 className="section-title">Cronoprogramma / Milestone</h2>
                <button
                  className="btn-add"
                  onClick={() => setIsMilestoneModalOpen(true)}
                >
                  + Aggiungi Milestone
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
                          {getMilestoneStatusLabel(milestone.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Nessuna milestone definita.</p>
                )}
              </div>
            </section>

            {/* Rischi */}
            <section className="details-section">
              <div className="section-header">
                <h2 className="section-title">Rischi</h2>
                <button
                  className="btn-add"
                  onClick={() => setIsRiskModalOpen(true)}
                >
                  + Aggiungi Rischio
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
                            {getSeverityLabel(risk.severity)}
                          </span>
                        </div>
                        {risk.mitigation && (
                          <p className="risk-mitigation">
                            <strong>Mitigazione:</strong> {risk.mitigation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Nessun rischio identificato.</p>
                )}
              </div>
            </section>
          </div>

          <div className="side-column">
            {/* File / Documenti */}
            <section className="details-section">
              <div className="section-header">
                <h2 className="section-title">File / Documenti</h2>
                <button className="btn-add btn-add-small">Carica</button>
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
                  <p className="empty-message">Nessun documento caricato.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Modal Aggiungi Milestone */}
      <Modal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        title="Aggiungi Milestone"
        size="small"
      >
        <form className="add-form" onSubmit={handleAddMilestone}>
          <div className="form-group">
            <label>Nome Milestone</label>
            <input
              type="text"
              value={newMilestone.name}
              onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
              placeholder="es. Getto fondazioni"
              required
            />
          </div>
          <div className="form-group">
            <label>Data Scadenza</label>
            <input
              type="date"
              value={newMilestone.dueDate}
              onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Stato</label>
            <select
              value={newMilestone.status}
              onChange={(e) => setNewMilestone({ ...newMilestone, status: e.target.value })}
            >
              <option value="Not Started">Non Iniziato</option>
              <option value="In Progress">In Corso</option>
              <option value="Done">Completato</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsMilestoneModalOpen(false)}>
              Annulla
            </button>
            <button type="submit" className="btn-primary">Aggiungi Milestone</button>
          </div>
        </form>
      </Modal>

      {/* Modal Aggiungi Rischio */}
      <Modal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        title="Aggiungi Rischio"
        size="medium"
      >
        <form className="add-form" onSubmit={handleAddRisk}>
          <div className="form-group">
            <label>Titolo Rischio</label>
            <input
              type="text"
              value={newRisk.title}
              onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
              placeholder="es. Ritardo approvazione permessi"
              required
            />
          </div>
          <div className="form-group">
            <label>Gravità</label>
            <select
              value={newRisk.severity}
              onChange={(e) => setNewRisk({ ...newRisk, severity: e.target.value })}
            >
              <option value="Low">Basso</option>
              <option value="Medium">Medio</option>
              <option value="High">Alto</option>
            </select>
          </div>
          <div className="form-group">
            <label>Mitigazione</label>
            <textarea
              value={newRisk.mitigation}
              onChange={(e) => setNewRisk({ ...newRisk, mitigation: e.target.value })}
              placeholder="Descrivi la strategia di mitigazione..."
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsRiskModalOpen(false)}>
              Annulla
            </button>
            <button type="submit" className="btn-primary">Aggiungi Rischio</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProjectDetails;
