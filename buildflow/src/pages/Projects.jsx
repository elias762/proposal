import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Modal from '../components/Modal/Modal';
import NewProjectForm from '../components/NewProjectForm/NewProjectForm';
import { useProjects } from '../context/ProjectsContext';
import './Projects.css';

function Projects() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getTypeClass = (type) => {
    switch (type) {
      case 'Residenziale':
        return 'type-residential';
      case 'Commerciale':
        return 'type-commercial';
      case 'Ristrutturazione':
        return 'type-renovation';
      case 'Infrastrutture':
        return 'type-infrastructure';
      default:
        return '';
    }
  };

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

  const handleRowClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="projects-page">
      <Header
        title="Progetti"
        subtitle="Pianifica, monitora e revisiona i progetti edilizi."
      />

      <div className="projects-content">
        <div className="projects-toolbar">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cerca per nome progetto o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-new-project" onClick={() => setIsModalOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuovo Progetto
          </button>
        </div>

        <div className="projects-table-card">
          <div className="table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Nome Progetto</th>
                  <th>Cliente</th>
                  <th>Tipologia</th>
                  <th>Stato</th>
                  <th>Data Inizio</th>
                  <th>Data Fine</th>
                  <th>Budget</th>
                  <th>Project Manager</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => handleRowClick(project.id)}
                    className="clickable-row"
                  >
                    <td className="project-name">{project.name}</td>
                    <td>{project.client}</td>
                    <td>
                      <span className={`type-badge ${getTypeClass(project.type)}`}>
                        {project.type}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </td>
                    <td>{formatDate(project.startDate)}</td>
                    <td>{formatDate(project.targetEndDate)}</td>
                    <td className="budget">{formatBudget(project.budget)}</td>
                    <td>{project.projectManager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProjects.length === 0 && (
              <div className="no-results">
                <p>Nessun progetto trovato per "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crea Nuovo Progetto"
        size="large"
      >
        <NewProjectForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default Projects;
