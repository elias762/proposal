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
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
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
                  {project.status}
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
