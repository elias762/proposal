import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientsData } from '../data/dummyData';
import { useProjects } from '../context/ProjectsContext';
import './ClientDetails.css';

// Dummy proposals data for the client
const generateClientProposals = (clientName) => {
  const baseProposals = [
    {
      id: 1,
      title: `Proposta Fit-Out Commerciale – ${clientName}`,
      createdDate: '2026-01-10',
      estimatedDuration: 18,
      estimatedCost: 920000,
      confidence: 'high',
      references: 2,
    },
    {
      id: 2,
      title: `Valutazione Ristrutturazione – ${clientName}`,
      createdDate: '2025-12-15',
      estimatedDuration: 12,
      estimatedCost: 450000,
      confidence: 'medium',
      references: 1,
    },
    {
      id: 3,
      title: `Adeguamento Infrastrutturale – ${clientName}`,
      createdDate: '2025-11-20',
      estimatedDuration: 24,
      estimatedCost: 1850000,
      confidence: 'low',
      references: 3,
    },
  ];
  return baseProposals.slice(0, Math.floor(Math.random() * 3) + 1);
};

function ClientDetails() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [activeProjectTab, setActiveProjectTab] = useState('active');

  const client = clientsData.find(c => c.id === parseInt(clientId));

  const clientProjects = useMemo(() => {
    if (!client) return { active: [], completed: [] };
    const all = projects.filter(p => p.client === client.name);
    return {
      active: all.filter(p => p.status !== 'Completed'),
      completed: all.filter(p => p.status === 'Completed'),
    };
  }, [client, projects]);

  const proposals = useMemo(() => {
    if (!client) return [];
    return generateClientProposals(client.name);
  }, [client]);

  if (!client) {
    return (
      <div className="client-details">
        <div className="not-found">
          <h2>Client not found</h2>
          <button onClick={() => navigate('/clients')}>Back to Clients</button>
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

  const formatCurrency = (amount) => {
    return `€${amount.toLocaleString('de-DE')}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'On Track': return 'status-on-track';
      case 'At Risk': return 'status-at-risk';
      case 'Delayed': return 'status-delayed';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };

  const getConfidenceClass = (confidence) => {
    switch (confidence) {
      case 'high': return 'confidence-high';
      case 'medium': return 'confidence-medium';
      case 'low': return 'confidence-low';
      default: return '';
    }
  };

  // Generate insights based on client data
  const insights = useMemo(() => {
    const allProjects = [...clientProjects.active, ...clientProjects.completed];
    const types = [...new Set(allProjects.map(p => p.type))];
    const budgets = allProjects.map(p => p.budget).filter(b => typeof b === 'number');
    const avgBudget = budgets.length > 0 ? budgets.reduce((a, b) => a + b, 0) / budgets.length : 0;

    const constraints = allProjects.flatMap(p => p.constraints || []);
    const constraintCounts = constraints.reduce((acc, c) => {
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {});
    const commonConstraints = Object.entries(constraintCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([c]) => c);

    let suggestedApproach = 'Approccio standard con focus su qualità e tempistiche.';
    if (client.notes.toLowerCase().includes('prezzo fisso') || client.notes.toLowerCase().includes('preventiv')) {
      suggestedApproach = 'Presentare preventivi a prezzo fisso con confini di ambito chiari. Includere specifiche dettagliate fin dall\'inizio.';
    } else if (client.notes.toLowerCase().includes('sostenibil') || client.notes.toLowerCase().includes('ambientale') || client.notes.toLowerCase().includes('certificazion')) {
      suggestedApproach = 'Enfatizzare materiali sostenibili e conformità ambientale. Includere certificazioni green se applicabili.';
    } else if (client.notes.toLowerCase().includes('fermo') || client.notes.toLowerCase().includes('24/7') || client.notes.toLowerCase().includes('operazion')) {
      suggestedApproach = 'Pianificare per minimo impatto operativo. Considerare lavori per fasi e orari notturni/weekend.';
    } else if (client.notes.toLowerCase().includes('lusso') || client.notes.toLowerCase().includes('artigian') || client.notes.toLowerCase().includes('pregiat')) {
      suggestedApproach = 'Enfatizzare qualità artigianale e materiali pregiati. Proporre finiture di alto livello.';
    } else if (client.notes.toLowerCase().includes('appalto') || client.notes.toLowerCase().includes('procedura')) {
      suggestedApproach = 'Seguire rigorosamente le procedure di appalto. Preparare documentazione completa e dettagliata.';
    }

    return {
      typicalTypes: types.length > 0 ? types : ['Nessun progetto'],
      avgBudgetRange: avgBudget > 0
        ? `${formatCurrency(Math.round(avgBudget * 0.7))} – ${formatCurrency(Math.round(avgBudget * 1.3))}`
        : 'Dati non disponibili',
      commonConstraints: commonConstraints.length > 0 ? commonConstraints : ['Nessuno identificato'],
      suggestedApproach,
    };
  }, [client, clientProjects]);

  const currentProjects = activeProjectTab === 'active' ? clientProjects.active : clientProjects.completed;

  return (
    <div className="client-details">
      <div className="details-header">
        <button className="back-button" onClick={() => navigate('/clients')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Clients
        </button>
        <div className="header-content">
          <div className="client-header-info">
            <div className="client-avatar-large">
              {client.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div className="client-header-text">
              <h1 className="client-title">{client.name}</h1>
              <span className="client-industry">{client.industry}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="details-content">
        <div className="details-grid">
          <div className="main-column">
            {/* Client Overview */}
            <section className="details-section">
              <h2 className="section-title">Client Overview</h2>
              <div className="overview-card">
                <div className="overview-grid">
                  <div className="overview-item">
                    <span className="overview-label">Primary Contact</span>
                    <span className="overview-value">{client.contactName}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Email</span>
                    <span className="overview-value overview-email">{client.contactEmail}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Industry</span>
                    <span className="overview-value">{client.industry}</span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Last Activity</span>
                    <span className="overview-value">{formatDate(client.lastActivity)}</span>
                  </div>
                </div>
                <div className="client-notes">
                  <span className="overview-label">Notes</span>
                  <p className="notes-text">{client.notes}</p>
                </div>
              </div>
            </section>

            {/* Projects */}
            <section className="details-section">
              <div className="section-header">
                <h2 className="section-title">Projects</h2>
                <div className="tab-buttons">
                  <button
                    className={`tab-btn ${activeProjectTab === 'active' ? 'tab-active' : ''}`}
                    onClick={() => setActiveProjectTab('active')}
                  >
                    Active ({clientProjects.active.length})
                  </button>
                  <button
                    className={`tab-btn ${activeProjectTab === 'completed' ? 'tab-active' : ''}`}
                    onClick={() => setActiveProjectTab('completed')}
                  >
                    Completed ({clientProjects.completed.length})
                  </button>
                </div>
              </div>
              <div className="projects-card">
                {currentProjects.length > 0 ? (
                  <div className="projects-list">
                    {currentProjects.map((project) => (
                      <div
                        key={project.id}
                        className="project-row"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <div className="project-main">
                          <span className="project-name">{project.name}</span>
                          <span className={`status-badge ${getStatusClass(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="project-meta">
                          <span>{formatDate(project.startDate)} – {formatDate(project.targetEndDate)}</span>
                          <span className="meta-divider">·</span>
                          <span className="project-budget">
                            {typeof project.budget === 'number' ? formatCurrency(project.budget) : project.budget}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">
                    Nessun progetto {activeProjectTab === 'active' ? 'attivo' : 'completato'} per questo cliente.
                  </p>
                )}
              </div>
            </section>

            {/* Proposals */}
            <section className="details-section">
              <div className="section-header">
                <h2 className="section-title">Proposals</h2>
                <button className="btn-new-proposal" onClick={() => navigate('/proposals')}>
                  + New Proposal
                </button>
              </div>
              <div className="proposals-card">
                {proposals.length > 0 ? (
                  <div className="proposals-list">
                    {proposals.map((proposal) => (
                      <div key={proposal.id} className="proposal-row">
                        <div className="proposal-main">
                          <span className="proposal-title">{proposal.title}</span>
                          <div className="proposal-stats">
                            <span>{proposal.estimatedDuration} settimane</span>
                            <span className="stat-divider">·</span>
                            <span>{formatCurrency(proposal.estimatedCost)}</span>
                            <span className="stat-divider">·</span>
                            <span className={`confidence-badge ${getConfidenceClass(proposal.confidence)}`}>
                              {proposal.confidence === 'high' ? 'alta' : proposal.confidence === 'medium' ? 'media' : 'bassa'} confidenza
                            </span>
                          </div>
                          <div className="proposal-meta">
                            <span>Creata il {formatDate(proposal.createdDate)}</span>
                            <span className="meta-divider">·</span>
                            <span>{proposal.references} riferimenti</span>
                          </div>
                        </div>
                        <div className="proposal-actions">
                          <button className="btn-action">Apri</button>
                          <button className="btn-action">Duplica</button>
                          <button className="btn-action btn-action-danger">Elimina</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Nessuna proposta creata per questo cliente.</p>
                )}
              </div>
            </section>
          </div>

          <div className="side-column">
            {/* Client Insights */}
            <section className="details-section insights-section">
              <h2 className="section-title">Client Insights</h2>
              <div className="insights-card">
                <div className="insight-item">
                  <span className="insight-label">Typical Project Types</span>
                  <div className="insight-tags">
                    {insights.typicalTypes.map((type, i) => (
                      <span key={i} className="insight-tag">{type}</span>
                    ))}
                  </div>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Avg. Budget Range</span>
                  <span className="insight-value">{insights.avgBudgetRange}</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Common Constraints</span>
                  <div className="insight-tags">
                    {insights.commonConstraints.map((constraint, i) => (
                      <span key={i} className="insight-tag constraint-tag">{constraint}</span>
                    ))}
                  </div>
                </div>
                <div className="insight-item insight-approach">
                  <span className="insight-label">Suggested Approach</span>
                  <p className="insight-text">{insights.suggestedApproach}</p>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="details-section">
              <h2 className="section-title">Quick Stats</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-value">{clientProjects.active.length + clientProjects.completed.length}</span>
                  <span className="stat-label">Total Projects</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{proposals.length}</span>
                  <span className="stat-label">Proposals</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetails;
