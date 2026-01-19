import './ProjectsTable.css';

function ProjectsTable({ projects }) {
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

  return (
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
          {projects.map((project) => (
            <tr key={project.id}>
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
              <td className="budget">{project.budget}</td>
              <td>{project.projectManager}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectsTable;
