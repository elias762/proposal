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

  const getTypeClass = (type) => {
    switch (type) {
      case 'Residential':
        return 'type-residential';
      case 'Commercial':
        return 'type-commercial';
      case 'Renovation':
        return 'type-renovation';
      case 'Infrastructure':
        return 'type-infrastructure';
      default:
        return '';
    }
  };

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

  const handleRowClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="projects-page">
      <Header
        title="Projects"
        subtitle="Plan, track, and review construction projects."
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
              placeholder="Search by project name or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-new-project" onClick={() => setIsModalOpen(true)}>
            + New Project
          </button>
        </div>

        <div className="projects-table-card">
          <div className="table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>Target End</th>
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
                        {project.status}
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
                <p>No projects found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        size="large"
      >
        <NewProjectForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default Projects;
